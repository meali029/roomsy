import { NextRequest, NextResponse } from 'next/server';
import { GeminiLocationAI } from '@/libs/geminiLocationAI';

export async function POST(request: NextRequest) {
  try {
    const { workplace, budget } = await request.json();

    // Validate input
    if (!workplace || !budget) {
      return NextResponse.json(
        { success: false, error: 'Workplace and budget are required' },
        { status: 400 }
      );
    }

    if (typeof budget !== 'number' || budget <= 0) {
      return NextResponse.json(
        { success: false, error: 'Budget must be a positive number' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'AI service is not properly configured' },
        { status: 503 }
      );
    }

    // Get budget validation
    const validation = await GeminiLocationAI.validateBudget(
      workplace.trim(),
      budget
    );

    return NextResponse.json({
      success: true,
      validation,
      query: {
        workplace: workplace.trim(),
        budget: budget
      },
      provider: 'Gemini AI (FREE)',
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('Budget validation error:', error);
    
    let errorMessage = 'Failed to validate budget. Please try again.';
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'AI service configuration error. Please contact support.';
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Budget Validation API is running',
    methods: ['POST'],
    required: ['workplace', 'budget'],
    example: {
      workplace: 'I-8 Islamabad',
      budget: 10000
    }
  });
}
