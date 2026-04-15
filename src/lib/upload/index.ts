// Upload module index
export * from "./cloudinary";

// Generic upload handler
export async function handleUpload(
  file: File,
  options: {
    folder?: string;
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}
): Promise<{ url: string; publicId: string }> {
  const { folder = "general", maxSize = 10 * 1024 * 1024, allowedTypes } = options;

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed (${maxSize / (1024 * 1024)}MB)`);
  }

  // Validate file type
  if (allowedTypes && allowedTypes.length > 0) {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const mimeType = file.type;

    const isAllowed = allowedTypes.some(
      (type) =>
        type.toLowerCase() === fileExtension ||
        type.toLowerCase() === mimeType ||
        type.includes("*") && mimeType.startsWith(type.replace("*", ""))
    );

    if (!isAllowed) {
      throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(", ")}`);
    }
  }

  const result = await uploadFile(file, { folder });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

// Profile image upload
export async function uploadProfileImage(file: File): Promise<string> {
  const result = await handleUpload(file, {
    folder: "profiles",
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });
  return result.url;
}

// KYC document upload
export async function uploadKycDocument(file: File): Promise<string> {
  const result = await handleUpload(file, {
    folder: "kyc-documents",
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  });
  return result.url;
}

// Publication media upload
export async function uploadPublicationMedia(file: File): Promise<string> {
  const result = await handleUpload(file, {
    folder: "publications",
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ["image/*", "video/*"],
  });
  return result.url;
}

// Service portfolio upload
export async function uploadPortfolioImage(file: File): Promise<string> {
  const result = await handleUpload(file, {
    folder: "portfolio",
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  });
  return result.url;
}
