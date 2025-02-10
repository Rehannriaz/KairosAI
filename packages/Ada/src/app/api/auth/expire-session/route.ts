import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Delete the token cookie
  cookies().delete('token');

  // Redirect to login page after deleting cookie
  return NextResponse.redirect('/signup');
}
