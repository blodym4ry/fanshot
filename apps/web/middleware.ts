import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/src/lib/supabase-middleware';

/* Routes that require authentication */
const PROTECTED_ROUTES = ['/dashboard', '/create', '/gallery', '/credits', '/profile'];

/* Routes only accessible when NOT authenticated */
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ── Dev bypass: if Supabase env vars missing, skip auth checks ── */
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  /* ── Supabase session check ─────────────────────────────────────── */
  const { supabase, response } = createMiddlewareClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user);
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  /* Not logged in → trying to access protected route → redirect to login */
  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* Already logged in → trying to access auth route → redirect to dashboard */
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create/:path*',
    '/gallery/:path*',
    '/credits/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};
