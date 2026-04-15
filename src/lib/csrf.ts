import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

// CSRF Token generation and validation
const CSRF_TOKEN_LENGTH = 32;
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_COOKIE_NAME = "csrf_token";

// Generate a new CSRF token
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

// Validate CSRF token from request
export function validateCsrfToken(
  request: NextRequest,
  tokenFromCookie?: string
): boolean {
  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  // Get token from cookie
  const cookieToken = tokenFromCookie || request.cookies.get(CSRF_COOKIE_NAME)?.value;

  // Both tokens must exist and match
  if (!headerToken || !cookieToken) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(headerToken, cookieToken);
}

// Timing-safe string comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// CSRF protection middleware wrapper
export function withCsrfProtection(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    // Skip CSRF check for GET, HEAD, OPTIONS requests
    if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      return handler(request, context);
    }

    // Validate CSRF token
    if (!validateCsrfToken(request)) {
      return NextResponse.json(
        { error: "Token CSRF invalide. Veuillez rafraîchir la page." },
        { status: 403 }
      );
    }

    return handler(request, context);
  };
}

// Generate CSRF token and set cookie
export function setCsrfToken(response: NextResponse): string {
  const token = generateCsrfToken();

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return token;
}

// API endpoint to get CSRF token
export async function getCsrfTokenHandler(request: NextRequest): Promise<NextResponse> {
  const token = generateCsrfToken();
  const response = NextResponse.json({ token });

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}

// Client-side helper to get CSRF token
export const CsrfClient = {
  getToken: async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/csrf-token");
      if (!response.ok) return null;
      const data = await response.json();
      return data.token;
    } catch {
      return null;
    }
  },

  // Add CSRF token to fetch options
  withToken: async (options: RequestInit = {}): Promise<RequestInit> => {
    const token = await CsrfClient.getToken();
    if (!token) return options;

    return {
      ...options,
      headers: {
        ...options.headers,
        [CSRF_HEADER_NAME]: token,
      },
    };
  },
};
