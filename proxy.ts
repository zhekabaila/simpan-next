import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Auth routes - login/register pages
const AUTH_ROUTES = ['/login', '/register']

// Landing page - accessible to everyone (authenticated or not)
const LANDING_ROUTES = ['/']

// All public routes (auth + landing combined)
const PUBLIC_ROUTES = [...AUTH_ROUTES, ...LANDING_ROUTES]

// Role-based route mapping
const ROLE_ROUTES: Record<string, string> = {
  admin: '/admin/dashboard',
  petugas: '/petugas/dashboard',
  masyarakat: '/masyarakat/dashboard'
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

function isLandingRoute(pathname: string): boolean {
  return LANDING_ROUTES.some((route) => pathname.startsWith(route))
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

  // Case 2a: Logged in user accessing auth routes (login/register)
  if (isAuthRoute(pathname)) {
    // Redirect to dashboard based on role
    const defaultPath = getRoleBasedPath(role)
    return NextResponse.redirect(new URL(defaultPath, request.url))
  }

  // Case 2b: Logged in user accessing landing page
  if (isLandingRoute(pathname)) {
    // Allow access - users can still view the landing page
    return NextResponse.next()
  }

  // Case 2c: Logged in user accessing other public routes
  if (isPublic) {
    // Allow access
    return NextResponse.next()
  }

  // Case 2d: Check role-based access for protected routes
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
