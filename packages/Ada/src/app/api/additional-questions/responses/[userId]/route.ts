import { Answer } from '@/types/additional-questions';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = await createClient();

  const { userId } = params;

  try {
    const { data, error } = await supabase
      .from('user_additional_answers')
      .select(
        `
        question_id,
        answer,
        additional_questions (
          question
        )
      `
      )
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user responses:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = await createClient();

  const { userId } = params;
  const { answers }: { answers: Answer[] } = await req.json();

  try {
    const inserts = answers.map((ans) => ({
      user_id: userId,
      question_id: ans.question_id,
      answer: ans.answer,
    }));

    const { error } = await supabase
      .from('user_additional_answers')
      .upsert(inserts, {
        onConflict: 'user_id,question_id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('Error inserting user responses:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
