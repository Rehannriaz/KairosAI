// app/api/jobs/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '9');
    const start = (page - 1) * pageSize;
    
    // Get filter parameters
    const locations = searchParams.getAll('locations[]');
    const isRemoteParam = searchParams.get('isRemote');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');
    const categories = searchParams.getAll('categories[]');
    
    // Build query
    let query = supabase.from('jobs').select('*', { count: 'exact' });
    
    // Apply filters
    if (locations && locations.length > 0) {
      query = query.in('location', locations);
    }
    
    if (isRemoteParam !== null) {
      const isRemote = isRemoteParam === 'true';
      // Assuming you have a column in your table that indicates remote status
      // If not, you might need to parse this from location or description
      query = query.eq('is_remote', isRemote);
      
      // Alternative approach: Parse from description if you don't have a dedicated column
      // query = isRemote 
      //   ? query.ilike('description', '%remote%')
      //   : query.not('description', 'ilike', '%remote%');
    }
    
    if (minSalary) {
      // This assumes salary is stored as a number
      // If it's a string with formatting, you'll need additional parsing
      query = query.gte('salary', parseInt(minSalary));
    }
    
    if (maxSalary) {
      query = query.lte('salary', parseInt(maxSalary));
    }
    
    if (categories && categories.length > 0) {
      // If you don't have a specific column for job category,
      // you could search in the title or description
      const categoryFilters = categories.map(cat => `title.ilike.%${cat}%`);
      query = query.or(categoryFilters.join(','));
    }
    
    // Add pagination
    const { data: jobs, count, error } = await query
      .range(start, start + pageSize - 1)
      .order('posteddate', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      jobs,
      total: count || 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}