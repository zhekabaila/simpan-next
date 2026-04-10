import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/']

// Role-based route mapping
const ROLE_ROUTES: Record<string, string> = {
  admin: '/admin/dashboard',
  petugas: '/petugas/dashboard',
  masyarakat: '/masyarakat/dashboard'
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

function getRoleBasedPath(role?: string): string {
  return ROLE_ROUTES[role || ''] || '/login'
}

function getRequiredRoleForPath(pathname: string): string | null {
  if (pathname.startsWith('/admin/')) return 'admin'
  if (pathname.startsWith('/petugas/')) return 'petugas'
  if (pathname.startsWith('/masyarakat/')) return 'masyarakat'
  return null
}

const shouldRedirectRoute = ['/masyarakat', '/petugas', '/admin']

export async function proxy(request: NextRequest) {
  const c = await cookies()
  const pathname = request.nextUrl.pathname

  // Get auth data from cookies
  const token = c.get('token')?.value
  const role = c.get('role')?.value

  const isPublic = isPublicRoute(pathname)

  const isNotfoundPage = shouldRedirectRoute.some((e) => pathname === e)

  if (isNotfoundPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Case 1: No token
  if (!token) {
    // Redirect to login if accessing protected route
    if (!isPublic) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Allow access to public routes
    return NextResponse.next()
  }

  // Case 2: Has token

  // Case 2a: Logged in user accessing public routes (auth pages)
  if (isPublic) {
    // Redirect to dashboard based on role
    const defaultPath = getRoleBasedPath(role)
    return NextResponse.redirect(new URL(defaultPath, request.url))
  }

  // Case 2b: Check role-based access for protected routes
  const requiredRole = getRequiredRoleForPath(pathname)
  if (requiredRole && role && role !== requiredRole) {
    // User is trying to access a route that requires a different role
    const redirectPath = getRoleBasedPath(role)
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // Allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
}
