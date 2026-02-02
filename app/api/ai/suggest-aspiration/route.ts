// API Route: Suggest Aspiration with AI

import { NextRequest, NextResponse } from 'next/server';
import { suggestAspiration } from '@/lib/ai/openai-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const suggestion = await suggestAspiration(input);

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion. Please try again.' },
      { status: 500 }
    );
  }
}
