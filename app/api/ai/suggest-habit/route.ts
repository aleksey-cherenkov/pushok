// API Route: Suggest Habit with AI

import { NextRequest, NextResponse } from 'next/server';
import { suggestHabit } from '@/lib/ai/openai-client';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, 100); // 100 requests per hour

    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: rateLimit.message,
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        { status: 429 } // Too Many Requests
      );
    }

    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const suggestion = await suggestHabit(input);

    return NextResponse.json({ 
      suggestion,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetAt: rateLimit.resetAt,
      }
    });
  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion. Please try again.' },
      { status: 500 }
    );
  }
}
