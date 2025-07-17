import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const pathname = req.nextUrl.pathname

  // 1. Block access to protected routes if not logged in
  const isProtectedUserRoute = pathname.startsWith("/dashboard")
  const isProtectedAdminRoute = pathname.startsWith("/admin")

  if ((isProtectedUserRoute || isProtectedAdminRoute) && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 2. Block non-admins from admin routes
  if (isProtectedAdminRoute && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
