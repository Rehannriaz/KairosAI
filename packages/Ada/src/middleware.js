'use server';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Define routes
const publicRoutes = [
  '/',
  '/pricing',
  '/about',
  '/faqs',
  '/login',
  '/signup',
  '/forgotpass',
  /^\/reset-password\/[^\/]+$/,
];

const openRoutes = ['/about', '/faqs', '/static/privacy-policy'];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const session = req.cookies.get('token');
  const isPublicRoute = publicRoutes.some((route) =>
    route instanceof RegExp ? route.test(path) : route === path
  );
  const isOpenRoute = openRoutes.some((route) =>
    route instanceof RegExp ? route.test(path) : route === path
  );

  try {
    if (session) {
      const decodedToken = jwt.decode(session.value);
      if (isOpenRoute) {
        return NextResponse.next();
      }
      // Expired session handling
      if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.delete('token'); // Clear expired token
        return response;
      }

      // Prevent logged-in users from accessing public routes
      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      return NextResponse.next(); // Allow access to protected routes
    } else {
      // Allow access to openRoutes (like about, faqs)
      if (isPublicRoute || isOpenRoute) {
        return NextResponse.next();
      }

      // Redirect non-logged-in users from protected routes to login
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
