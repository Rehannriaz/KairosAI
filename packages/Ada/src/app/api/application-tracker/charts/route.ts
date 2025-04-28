import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch all applications for a specific user, count them by month
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get applications for the user
    const { data: applications, error } = await supabase
      .from('application_tracker')
      .select('applied_date')
      .eq('user_id', userId)
      .order('applied_date', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json({ applications: [] });
    }

    // Initialize an array to store the count of applications for each month
    const monthlyCounts = new Array(12).fill(0);

    // Process the applications and count them by month
    applications.forEach((application: any) => {
      const appliedMonth = new Date(application.applied_date).getMonth();
      monthlyCounts[appliedMonth]++;
    });

    // Return the processed data in the desired format
    return NextResponse.json({
      applications: monthlyCounts,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
