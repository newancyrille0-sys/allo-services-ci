import { NextRequest, NextResponse } from "next/server";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL?.split("@")[1]?.split("/")[0];
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_URL?.split("://")[1]?.split(":")[0];
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_URL?.split("://")[1]?.split(":")[1]?.split("@")[0];

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: string;
}

interface UploadOptions {
  folder?: string;
  resource_type?: "image" | "video" | "raw" | "auto";
  transformation?: object;
  tags?: string[];
  public_id?: string;
  overwrite?: boolean;
}

// Generate signature for authenticated upload
function generateSignature(params: Record<string, any>, timestamp: number): string {
  const crypto = require("crypto");
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const stringToSign = `${sortedParams}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  return crypto.createHash("sha1").update(stringToSign).digest("hex");
}

// Upload file to Cloudinary
export async function uploadToCloudinary(
  file: File | Buffer,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary configuration missing. Please set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = options.folder || "allo-services-ci";

  const params: Record<string, any> = {
    folder,
    timestamp,
  };

  if (options.tags) {
    params.tags = options.tags.join(",");
  }
  if (options.public_id) {
    params.public_id = options.public_id;
  }
  if (options.overwrite !== undefined) {
    params.overwrite = options.overwrite;
  }

  // For unsigned uploads (no API secret needed client-side)
  const unsignedUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();

  // Convert Buffer to File if needed
  let fileToUpload: File | Blob;
  if (Buffer.isBuffer(file)) {
    fileToUpload = new Blob([file]);
  } else {
    fileToUpload = file;
  }

  formData.append("file", fileToUpload);
  formData.append("folder", folder);
  formData.append("timestamp", timestamp.toString());

  if (unsignedUploadPreset) {
    formData.append("upload_preset", unsignedUploadPreset);
  } else {
    const signature = generateSignature(params, timestamp);
    formData.append("api_key", CLOUDINARY_API_KEY || "");
    formData.append("signature", signature);
  }

  const resourceType = options.resource_type || "auto";

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudinary upload failed: ${error}`);
  }

  return response.json();
}

// Upload multiple files
export async function uploadMultiple(
  files: (File | Buffer)[],
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult[]> {
  const results = await Promise.all(
    files.map((file) => uploadToCloudinary(file, options))
  );
  return results;
}

// Delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary configuration missing for delete operation.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const signature = generateSignature(params, timestamp);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.ok;
}

// Get optimized URL
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    format?: string;
    quality?: string | number;
  } = {}
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    return publicId; // Return as-is if not configured
  }

  const transformations: string[] = [];

  if (options.width || options.height) {
    const crop = options.crop || "fill";
    const dims = [];
    if (options.width) dims.push(`w_${options.width}`);
    if (options.height) dims.push(`h_${options.height}`);
    transformations.push(`${dims.join(",")},c_${crop}`);
  }

  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  }

  if (options.format) {
    transformations.push(`f_${options.format}`);
  }

  const transformString = transformations.length > 0 ? `${transformations.join(",")}/` : "";

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}${publicId}`;
}

// Mock upload for development (stores locally)
export async function mockUpload(
  file: File | Buffer,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  // Generate a mock public ID
  const publicId = `${options.folder || "mock"}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // In development, return a placeholder URL
  return {
    public_id: publicId,
    secure_url: `https://via.placeholder.com/800x600?text=Mock+Upload`,
    url: `https://via.placeholder.com/800x600?text=Mock+Upload`,
    format: "jpg",
    width: 800,
    height: 600,
    bytes: 1024,
    resource_type: "image",
  };
}

// Main upload function that switches between Cloudinary and mock
export async function uploadFile(
  file: File | Buffer,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  // Use mock if Cloudinary is not configured
  if (!CLOUDINARY_CLOUD_NAME || process.env.NODE_ENV === "test") {
    console.log("Using mock upload (Cloudinary not configured)");
    return mockUpload(file, options);
  }

  return uploadToCloudinary(file, options);
}
