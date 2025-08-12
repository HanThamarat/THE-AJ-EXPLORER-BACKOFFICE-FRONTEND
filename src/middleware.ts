import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Get token from cookies (since localStorage is not available)
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
  const recentPaths = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("recentPaths="))
    ?.split("=")[1];
    
  const isAuthRoute = req.nextUrl.pathname.startsWith("/cms");
  const isLoginRoute = req.nextUrl.pathname === "/";  

  if (!token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && isLoginRoute) {
    return NextResponse.redirect(new URL(recentPaths || "/cms/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/cms/:path*"],
};