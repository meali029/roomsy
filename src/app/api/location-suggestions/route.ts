import { NextRequest, NextResponse } from 'next/server';
import { GeminiLocationAI } from '@/libs/geminiLocationAI';

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute

  const current = rateLimitMap.get(ip);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  current.count++;
  return { allowed: true, remaining: maxRequests - current.count };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = getRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please wait a minute before trying again.',
          retryAfter: 60
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    console.log('Received request body:', body); // Debug log

    const { workplace, budget, preferences } = body;

    // Enhanced input validation
    if (!workplace || typeof workplace !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid workplace location is required' },
        { status: 400 }
      );
    }

    if (!budget || (typeof budget !== 'number' && isNaN(parseInt(budget))) || budget <= 0) {
      return NextResponse.json(
        { success: false, error: 'Budget must be a positive number' },
        { status: 400 }
      );
    }

    const budgetNumber = typeof budget === 'number' ? budget : parseInt(budget);

    // Budget validation for Pakistani context
    if (budgetNumber < 3000) {
      return NextResponse.json(
        { success: false, error: 'Budget too low. Minimum budget should be PKR 3,000 for accommodation in Pakistan.' },
        { status: 400 }
      );
    }

    if (budgetNumber > 500000) {
      return NextResponse.json(
        { success: false, error: 'Budget seems unusually high. Please enter a realistic monthly budget.' },
        { status: 400 }
      );
    }

    // Workplace validation (basic check for Pakistani locations)
    const workplaceLower = workplace.toLowerCase().trim();
    if (workplaceLower.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Please provide a more specific workplace location' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI service is not properly configured. Please contact support.' 
        },
        { status: 503 }
      );
    }

    // Get AI suggestions with enhanced query
    const suggestions = await GeminiLocationAI.getAreaSuggestions({
      workplace: workplace.trim(),
      budget: budgetNumber,
      preferences: preferences || {}
    });

    return NextResponse.json({
      success: true,
      suggestions,
      query: {
        workplace: workplace.trim(),
        budget: budgetNumber,
        preferences: preferences || {}
      },
      provider: 'Gemini AI (FREE)',
      timestamp: new Date().toISOString(),
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: new Date(Date.now() + 60000).toISOString()
      }
    }, {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      }
    });

  } catch (error: unknown) {
    console.error('Location suggestion error:', error);
    
    // Handle specific error types
    let errorMessage = 'Failed to get location suggestions. Please try again.';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message?.includes('API key')) {
        errorMessage = 'AI service configuration error. Please contact support.';
        statusCode = 503;
      } else if (error.message?.includes('quota')) {
        errorMessage = 'Service temporarily unavailable due to high demand. Please try again in a few minutes.';
        statusCode = 503;
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
        statusCode = 502;
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
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
