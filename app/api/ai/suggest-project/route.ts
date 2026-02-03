import { NextRequest, NextResponse } from 'next/server';
import { suggestProject } from '@/lib/ai/openai-client';
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
        { status: 429 }
      );
    }

    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const suggestion = await suggestProject(description);

    return NextResponse.json({ 
      suggestion,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetAt: rateLimit.resetAt,
      }
    });
  } catch (error) {
    console.error('AI project suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate project suggestion. Please try again.' },
      { status: 500 }
    );
  }
}
