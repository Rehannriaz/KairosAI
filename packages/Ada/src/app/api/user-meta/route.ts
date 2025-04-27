// app/api/user-meta/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get user ID from query parameter
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch data for the specific user from user_meta table
    const { data, error } = await supabase
      .from('user_meta')
      .select('id, created_at, jobs_applied, available_jobs, upcoming_interviews, user_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1); // Get the most recent record for that user
    
    if (error) {
      console.error('Error fetching user meta data:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('Fetched user meta data for user ID:', userId, data);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}