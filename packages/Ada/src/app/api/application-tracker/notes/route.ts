// app/api/application-tracker/notes/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with the service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch notes for a specific application
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get notes for the application
    const { data: notes, error } = await supabase
      .from('application_tracker_notes')
      .select('*')
      .eq('application_id', applicationId)
      .order('id', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { application_id, note } = body;

    // Validate required fields
    if (!application_id || !note) {
      return NextResponse.json(
        {
          error:
            'Required fields missing: application_id and note are required',
        },
        { status: 400 }
      );
    }

    // Insert new note
    const { data, error } = await supabase
      .from('application_tracker_notes')
      .insert({ application_id, note })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update the parent application's updated_date
    await supabase
      .from('application_tracker')
      .update({ updated_date: new Date().toISOString() })
      .eq('id', application_id);

    return NextResponse.json({ note: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing note
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, note } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    if (!note) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      );
    }

    // Get the application_id to update parent updated_date
    const { data: existingNote } = await supabase
      .from('application_tracker_notes')
      .select('application_id')
      .eq('id', id)
      .single();

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Update note
    const { data: updatedNote, error } = await supabase
      .from('application_tracker_notes')
      .update({ note })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update the parent application's updated_date
    await supabase
      .from('application_tracker')
      .update({ updated_date: new Date().toISOString() })
      .eq('id', existingNote.application_id);

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a note
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    // Get the application_id to update parent updated_date
    const { data: existingNote } = await supabase
      .from('application_tracker_notes')
      .select('application_id')
      .eq('id', id)
      .single();

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Delete note
    const { error } = await supabase
      .from('application_tracker_notes')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update the parent application's updated_date
    await supabase
      .from('application_tracker')
      .update({ updated_date: new Date().toISOString() })
      .eq('id', existingNote.application_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
