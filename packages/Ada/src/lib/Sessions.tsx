'use server';
import { cookies } from 'next/headers';
export default async function LoginSession(jwtToken: string) {
  cookies().set('token', jwtToken, {
    httpOnly: true,
    secure: true,
    path: '/',
  });
}

export async function getJWT() {
  // const value = cookies().getAll();
  // return value;
  return cookies().get('token')?.value || null; // Ensure correct retrieval
}
