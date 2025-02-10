import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: any) {
  // Delete the token cookie
  cookies().delete('token');

  // Construct an absolute URL
  const redirectUrl = new URL('/login', req.nextUrl.origin);

  // Redirect to login page after deleting cookie
  return NextResponse.redirect(redirectUrl.toString());
}
