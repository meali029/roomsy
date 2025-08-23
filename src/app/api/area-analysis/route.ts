import { NextRequest, NextResponse } from 'next/server';
import { GeminiLocationAI } from '@/libs/geminiLocationAI';

export async function POST(request: NextRequest) {
  try {
    const { workplace, area, budget } = await request.json();

    // Validate input
    if (!workplace || !area || !budget) {
      return NextResponse.json(
        { success: false, error: 'Workplace, area, and budget are required' },
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

    // Get detailed area analysis
    const analysis = await GeminiLocationAI.analyzeSpecificArea(
      workplace.trim(),
      area.trim(),
      budget
    );

    return NextResponse.json({
      success: true,
      analysis,
      query: {
        workplace: workplace.trim(),
        area: area.trim(),
        budget: budget
      },
      provider: 'Gemini AI (FREE)',
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('Area analysis error:', error);
    
    let errorMessage = 'Failed to analyze area. Please try again.';
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'AI service configuration error. Please contact support.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
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
    message: 'Area Analysis API is running',
    methods: ['POST'],
    required: ['workplace', 'area', 'budget'],
    example: {
      workplace: 'I-8 Islamabad',
      area: 'G-9 Markaz',
      budget: 15000
    }
  });
}
