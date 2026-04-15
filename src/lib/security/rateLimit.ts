import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  message: "Trop de requêtes. Veuillez réessayer plus tard.",
};

export async function rateLimit(
  request: NextRequest,
  config: Partial<RateLimitConfig> = {}
): Promise<{ success: boolean; response?: NextResponse }> {
  const { windowMs, maxRequests, message } = { ...defaultConfig, ...config };

  // Get IP address
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Get path for key
  const path = new URL(request.url).pathname;
  const key = `rate_limit:${ip}:${path}`;

  try {
    // Check current rate limit
    const existing = await db.rateLimit.findUnique({
      where: { key },
    });

    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    if (!existing) {
      // Create new rate limit entry
      await db.rateLimit.create({
        data: { key, count: 1, resetAt },
      });
      return { success: true };
    }

    // Check if window has expired
    if (existing.resetAt < now) {
      // Reset the counter
      await db.rateLimit.update({
        where: { key },
        data: { count: 1, resetAt },
      });
      return { success: true };
    }

    // Check if limit exceeded
    if (existing.count >= maxRequests) {
      return {
        success: false,
        response: NextResponse.json(
          { error: message },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": maxRequests.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": existing.resetAt.toISOString(),
            },
          }
        ),
      };
    }

    // Increment counter
    await db.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    return { success: true };
  } catch (error) {
    console.error("Rate limit error:", error);
    // On error, allow the request (fail open)
    return { success: true };
  }
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // Auth endpoints - stricter limits
  register: { windowMs: 60 * 60 * 1000, maxRequests: 5 }, // 5 requests per hour
  login: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 attempts per 15 minutes
  otp: { windowMs: 60 * 1000, maxRequests: 3 }, // 3 OTP requests per minute
  
  // API endpoints - standard limits
  api: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 requests per minute
  upload: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 uploads per minute
  
  // Public endpoints - higher limits
  public: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
};
