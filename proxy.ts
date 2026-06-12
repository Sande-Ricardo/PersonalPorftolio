import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const session = request.cookies.get("__session")?.value
  const { pathname } = request.nextUrl

  // Define paths
  const isAdminPath = pathname.startsWith("/admin")
  const isLoginPage = pathname === "/admin/login"

  if (isAdminPath) {
    if (!session && !isLoginPage) {
      // Not logged in and trying to access admin pages -> redirect to login
      const url = new URL("/admin/login", request.url)
      return NextResponse.redirect(url)
    }

    if (session && isLoginPage) {
      // Logged in and trying to access login page -> redirect to admin dashboard
      const url = new URL("/admin", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
