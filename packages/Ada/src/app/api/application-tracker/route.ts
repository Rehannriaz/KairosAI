// app/api/application-tracker/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch all applications for a specific user
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
      .select(
        `
        *,
        application_tracker_notes (
          id,
          note
        )
      `
      )
      .eq('user_id', userId)
      .order('updated_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      company,
      position,
      status,
      location,
      salary,
      next_step,
      url,
      logo,
      notes,
    } = body;

    // Validate required fields
    if (!user_id || !company || !position || !status) {
      return NextResponse.json(
        {
          error:
            'Required fields missing: user_id, company, position, and status are required',
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Insert new application
    const { data: application, error } = await supabase
      .from('application_tracker')
      .insert({
        user_id,
        company,
        position,
        status,
        applied_date: now,
        updated_date: now,
        location,
        salary,
        next_step,
        url,
        logo,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add notes if provided
    if (notes && notes.length > 0 && application) {
      const { error: notesError } = await supabase
        .from('application_tracker_notes')
        .insert({ application_id: application.id, note: notes });

      if (notesError) {
        console.error('Error inserting notes:', notesError);
      }
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing application
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      user_id,
      company,
      position,
      status,
      location,
      salary,
      next_step,
      url,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Verify the application belongs to the user for security
    if (user_id) {
      const { data: existing, error: fetchError } = await supabase
        .from('application_tracker')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }

      if (existing.user_id !== user_id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Create update object with only provided fields
    const updateData: any = { updated_date: new Date().toISOString() };
    if (company) updateData.company = company;
    if (position) updateData.position = position;
    if (status) updateData.status = status;
    if (location !== undefined) updateData.location = location;
    if (salary !== undefined) updateData.salary = salary;
    if (next_step !== undefined) updateData.next_step = next_step;
    if (url !== undefined) updateData.url = url;

    // Update application
    const { data: updatedApplication, error } = await supabase
      .from('application_tracker')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove an application
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify the application belongs to the user before deletion
    const { data: existing, error: fetchError } = await supabase
      .from('application_tracker')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete application (notes will be deleted via cascade)
    const { error } = await supabase
      .from('application_tracker')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
