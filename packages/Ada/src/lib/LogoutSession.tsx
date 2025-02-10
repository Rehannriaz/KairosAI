'use server';
import { cookies } from 'next/headers';
export default async function LogOutSession() {
  if (cookies().get('token')) {
    cookies().delete('token');
  }
}
