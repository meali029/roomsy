import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with error handling
let genAI: GoogleGenerativeAI;

try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

export interface LocationQuery {
  workplace: string;
  budget: number;
  preferences?: {
    transportMode?: 'car' | 'public' | 'both';
    lifestyle?: 'quiet' | 'lively' | 'mixed';
    familySize?: number;
    description?: string;
    priorities?: string[];
  };
}

export interface LocationSuggestion {
  area: string;
  reasons: string[];
  commuteTime: string;
  averageRent: string;
  pros: string[];
  cons: string[];
  transportOptions: string[];
  nearbyAmenities: string[];
  safetyRating?: string;
  internetConnectivity?: string;
}

export class GeminiLocationAI {
  /**
   * Get smart area suggestions based on workplace and budget
   */
  static async getAreaSuggestions(query: LocationQuery): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini AI is not properly initialized. Please check your API key configuration.');
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more factual responses
        topP: 0.9,
        topK: 20,
        maxOutputTokens: 2500,
      },
    });

    // Enhanced, dynamic prompt that forces specific location analysis
    const prompt = `You are a LOCAL Pakistani real estate expert with deep knowledge of Pakistani cities, especially Islamabad, Rawalpindi, Lahore, Karachi, and their surrounding areas.

SPECIFIC USER QUERY:
- Work Location: "${query.workplace}"
- Monthly Budget: PKR ${query.budget.toLocaleString()}
- User Preferences: ${query.preferences?.description || 'General accommodation needs'}
- Transport Mode: ${query.preferences?.transportMode || 'flexible'}
- Lifestyle: ${query.preferences?.lifestyle || 'mixed'}
- Family Size: ${query.preferences?.familySize || 1}

CRITICAL INSTRUCTIONS:
1. ANALYZE THE SPECIFIC WORKPLACE LOCATION "${query.workplace}" - Don't give generic answers
2. If the workplace is in Islamabad, focus on Islamabad areas only
3. If the workplace is in Lahore, focus on Lahore areas only  
4. If the workplace is in Karachi, focus on Karachi areas only
5. If it's a specific area/sector, give nearby recommendations
6. Use REAL place names, REAL rent prices, REAL distances
7. NO generic responses - everything must be specific to "${query.workplace}"

RESPONSE FORMAT (be very specific to the work location):

LOCATION-SPECIFIC RECOMMENDATIONS FOR ${query.workplace}

AREA 1: [Specific nearby area name]
Distance from ${query.workplace}: [exact distance/time]
Realistic Rent: PKR [actual range based on 2024-2025 prices]
Commute Details: [specific route - mention actual roads/landmarks]
Why Perfect: [location-specific benefits related to ${query.workplace}]
Local Amenities: [actual nearby markets, hospitals, schools]
Area Profile: [specific characteristics of this exact area]

AREA 2: [Another specific nearby area]
[Same detailed format]

AREA 3: [Third specific area]
[Same detailed format]

BUDGET REALITY FOR ${query.workplace} WORKERS:
- Room/Studio: PKR [realistic range]
- 1-Bedroom: PKR [realistic range]  
- Shared Flat: PKR [realistic range]
- Utilities: PKR [realistic monthly cost]
- Transport to ${query.workplace}: PKR [realistic daily/monthly cost]

SPECIFIC TIPS FOR ${query.workplace} LOCATION:
- [Location-specific advice about traffic timing]
- [Area-specific rental tips]
- [Workplace-specific transport advice]

IMPORTANT: If you don't have specific knowledge about "${query.workplace}", say "I need more details about this location" instead of giving generic answers.

Focus ONLY on areas that are practically accessible from "${query.workplace}" with real commute times and costs.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from AI service');
      }

      // Check if response is too generic (contains placeholder text)
      if (text.includes('[specific') || text.includes('[actual') || text.includes('[realistic range]')) {
        // Retry with more specific prompt
        return await this.getDetailedLocationAnalysis(query);
      }

      return text;
    } catch (error) {
      console.error('Gemini API error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Invalid API key. Please check your Gemini API key configuration.');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          throw new Error('API quota exceeded. Please try again in a few minutes.');
        } else if (error.message.includes('SAFETY')) {
          throw new Error('Content filtered by safety systems. Please try with different workplace location.');
        }
      }
      
      throw new Error('Failed to get area suggestions. Please try again later.');
    }
  }

  /**
   * More detailed analysis with forced specificity
   */
  static async getDetailedLocationAnalysis(query: LocationQuery): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini AI is not properly initialized.');
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2, // Very low for factual responses
        topP: 0.8,
        maxOutputTokens: 2000,
      },
    });

    const prompt = `TASK: Provide SPECIFIC location recommendations for someone working at "${query.workplace}" in Pakistan.

You must:
1. Identify which city "${query.workplace}" is in
2. Give 3 REAL nearby areas with ACTUAL names
3. Provide REAL rent prices (not ranges like [X-Y])
4. Give ACTUAL distances and commute times
5. Name REAL roads, markets, and landmarks

USER DETAILS:
- Works at: "${query.workplace}"
- Budget: PKR ${query.budget.toLocaleString()}/month
- Needs: ${query.preferences?.description || 'accommodation'}

STRICT FORMAT:

AREA 1: [Real area name near ${query.workplace}]
Distance: [Actual km/minutes from ${query.workplace}]
Rent: PKR [specific amount, not range]
Commute: [Name actual roads/routes]
Markets: [Name real markets/shops nearby]

AREA 2: [Another real area name]
[Same specific details]

AREA 3: [Third real area name]  
[Same specific details]

BUDGET BREAKDOWN:
Room: PKR [specific amount]
Bills: PKR [specific amount]
Transport: PKR [specific amount]

IMPORTANT: Use only REAL place names, REAL prices, REAL distances. If you don't know specifics about "${query.workplace}", say "Please provide a more specific location or landmark near your workplace."`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Detailed analysis error:', error);
      throw new Error('Failed to get detailed location analysis.');
    }
  }

  /**
   * Get detailed area analysis for a specific location
   */
  static async analyzeSpecificArea(workplace: string, suggestedArea: string, budget: number): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini AI is not properly initialized.');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `DETAILED AREA ANALYSIS

Workplace: ${workplace}
Suggested Area: ${suggestedArea}
Budget: PKR ${budget.toLocaleString()}

Provide detailed analysis of ${suggestedArea} for someone working at ${workplace}:

LOCATION DETAILS:
- Exact location and boundaries
- Distance from ${workplace}
- Best routes to workplace

COMMUTE ANALYSIS:
- Peak hours timing (morning/evening)
- Transport options (car, bus, taxi, careem/uber)
- Monthly transport costs
- Alternative routes during traffic

HOUSING OPTIONS:
- Typical room/flat types available
- Rent ranges for different options
- Best areas within ${suggestedArea} to focus
- What to expect in PKR ${budget.toLocaleString()} budget

DAILY LIFE:
- Grocery markets and shops
- Restaurants and food options
- Medical facilities
- Educational institutes nearby
- Mosques and religious facilities

COST BREAKDOWN:
- Rent: PKR [amount]
- Utilities (gas/electricity): PKR [amount] 
- Internet: PKR [amount]
- Transport: PKR [amount]
- Food/groceries: PKR [amount]

RECOMMENDATION:
[Final verdict if this area is good for this user]

Be very specific about ${suggestedArea} in Pakistani context.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini area analysis error:', error);
      throw new Error('Failed to analyze area. Please try again.');
    }
  }

  /**
   * Get quick budget check
   */
  static async validateBudget(workplace: string, budget: number): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini AI is not properly initialized.');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `BUDGET REALITY CHECK

Workplace: ${workplace}
Stated Budget: PKR ${budget.toLocaleString()}/month

As a local expert for Pakistani cities, assess if this budget is realistic:

BUDGET ASSESSMENT:
- Is PKR ${budget.toLocaleString()} realistic for someone working at ${workplace}?
- What can they afford with this budget?
- What areas should they focus on?

SMART SUGGESTIONS:
- If budget is tight: [suggestions for cheaper options]
- If budget is good: [suggestions for better areas]
- Budget allocation advice

REALISTIC EXPECTATIONS:
- Type of accommodation possible
- Areas to avoid (too expensive)
- Areas to consider (good value)

Keep it brief and practical for Pakistan context.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini budget check error:', error);
      throw new Error('Failed to check budget. Please try again.');
    }
  }
}
