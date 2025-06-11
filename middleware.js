import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export const config = { 
  matcher: [
    '/api/:path*',
    '/entries/:path*',
    '/register/:path*',
    '/admin/:path*'
  ]
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for certain paths including auth-related endpoints
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // Admin routes protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/register') {
    // Check for admin session cookie or token
    const adminToken = request.cookies.get('admin_token')?.value;
    
    if (!adminToken) {
      // Redirect to admin login if no token is present
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Admin API protection
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/validate') {
    const adminToken = request.cookies.get('admin_token')?.value;
    
    if (!adminToken) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
  }
  
  try {
    // Get configuration from Edge Config
    const maintenanceMode = await get("maintenance_mode");
    const allowedRoutes = await get("allowed_routes") || [];
    
    // Check if in maintenance mode
    if (maintenanceMode && !allowedRoutes.includes(pathname)) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }
    
    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}
