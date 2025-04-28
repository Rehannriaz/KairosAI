// app/actions/resumeActions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Checks if the user has submitted a resume and redirects to /resume if not
 * @param userId The ID of the user to check
 * @returns Promise<boolean> True if user has a resume, false if not (though redirect happens first if no resume)
 */
export async function checkUserHasResume(userId: string): Promise<boolean> {
  if (!userId) {
    console.error('No user ID provided');
    redirect('/login');
  }

  const supabase = createClient();

  // Check if user has a resume in the database
  const { data: resumes, error } = await (await supabase)
    .from('resumes')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (error) {
    console.error('Error checking for user resume:', error);
    return false;
  }

  // If no resumes found, redirect to resume creation page
  if (!resumes || resumes.length === 0) {
    redirect('/resume');
  }
  // User has a resume
  return true;
}
