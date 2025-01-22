'use server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// 1. Specify protected and public routes
const publicRoutes = [
  '/login',
  '/signup',
  '/forgotpass',
  /^\/reset-password\/[^\/]+$/,
  /^\/auth\/[^\/]+$/,
];
const openRoutes = ['/static/privacy-policy'];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some((route) =>
    route instanceof RegExp ? route.test(path) : route === path
  );
  const isOpenRoute = openRoutes.some((route) =>
    route instanceof RegExp ? route.test(path) : route === path
  );
  if (isOpenRoute || isPublicRoute) {
    return NextResponse.next();
  }
  const session = cookies().get('token');

  if (session) {
    try {
      const decodedToken = jwt.decode(session.value);

      if (decodedToken.exp * 1000 < Date.now()) {
        // Redirect to the API route that will delete the cookie
        return NextResponse.redirect(
          new URL('/api/auth/expire-session', req.url)
        );
      }

      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/api/auth/expiresession', req.url));
    }
  } else if (!isPublicRoute) {
    return NextResponse.redirect(new URL('/signup', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
