import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export const config = {
  matcher: [
    "/api/:path*",
    "/entries/:path*",
    "/register/:path*",
    "/admin/:path*",
  ],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for certain paths including auth-related endpoints
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Admin routes protection
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    pathname !== "/admin/register"
  ) {
    // Check for admin session cookie or token
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      // Redirect to admin login if no token is present
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Admin API protection
  if (pathname.startsWith("/api/admin")) {
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
  }

  try {
    // Get configuration from Edge Config
    const submissionEnabled = await get("submissionEnabled");
    const votingEnabled = await get("votingEnabled");

    // Voting path protection
    if (pathname.startsWith("/api/vote") && votingEnabled === false) {
      return NextResponse.json(
        { error: "Voting is currently disabled" },
        { status: 403 }
      );
    }

    // Submission path protection
    if (
      (pathname.startsWith("/register") ||
        pathname.startsWith("/api/entries")) &&
      submissionEnabled === false
    ) {
      if (pathname.startsWith("/register")) {
        // Redirect to home page with a message
        return NextResponse.redirect(
          new URL("/?submissionsDisabled=true", request.url)
        );
      } else {
        // API response
        return NextResponse.json(
          { error: "Submissions are currently disabled" },
          { status: 403 }
        );
      }
    }
  } catch (error) {
    console.error("Edge Config error:", error);
    // Continue without restricting if Edge Config fails
  }

  return NextResponse.next();
}
