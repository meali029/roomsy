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

    // Get AI suggestions
    const suggestions = await GeminiLocationAI.getAreaSuggestions({
      workplace: workplace.trim(),
      budget: budget
    });

    return NextResponse.json({
      success: true,
      suggestions,
      query: {
        workplace,
        budget
      },
      provider: 'Gemini AI (FREE)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Location suggestion error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get location suggestions. Please check your API key and try again.' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Location Suggestions API is running',
    methods: ['POST'],
    required: ['workplace', 'budget'],
    example: {
      workplace: 'I-8 Islamabad',
      budget: 10000
    }
  });
}
