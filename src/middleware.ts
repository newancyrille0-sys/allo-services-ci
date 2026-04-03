import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for route protection
 * - Protects dashboard routes (requires authentication)
 * - Protects admin routes (requires ADMIN role)
 * - Redirects unauthenticated users to login
 */

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/client",
  "/provider",
];

// Routes that require ADMIN role
const adminRoutes = [
  "/admin",
];

// Public routes that should redirect authenticated users
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

// Routes that are always public
const publicRoutes = [
  "/",
  "/services",
  "/providers",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/api",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies
  const authToken = request.cookies.get("auth-token")?.value;
  const userRole = request.cookies.get("user-role")?.value;
  
  // Check if it's an API route - let it pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if it's a static file or Next.js internal route
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") // Files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if trying to access admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    // Special case: admin login page
    if (pathname === "/admin/login") {
      // If already logged in as admin, redirect to dashboard
      if (authToken && userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Require authentication and ADMIN role
    if (!authToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "ADMIN") {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Check if trying to access protected routes (client/provider dashboard)
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based route access
    if (pathname.startsWith("/client") && userRole && !["CLIENT", "ADMIN"].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/provider") && userRole && !["PROVIDER", "ADMIN"].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Check if trying to access auth routes while logged in
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  
  if (isAuthRoute && authToken) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = getDashboardPath(userRole);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

/**
 * Get the dashboard path based on user role
 */
function getDashboardPath(role?: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "PROVIDER":
      return "/provider";
    case "CLIENT":
    default:
      return "/client";
  }
}

/**
 * Configure which routes use this middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
