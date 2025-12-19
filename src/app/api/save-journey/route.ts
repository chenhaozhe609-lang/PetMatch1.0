import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { personalityScores, constraints, decisionPath, recommendedResult } = body;

    const { data, error } = await supabase
      .from('user_journeys')
      .insert([
        {
          personality_scores: personalityScores,
          constraints: constraints,
          decision_path: decisionPath,
          recommended_result: recommendedResult,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
