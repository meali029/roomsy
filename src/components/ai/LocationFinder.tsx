'use client';

import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Heart, 
  Home, 
  Users, 
  Lightbulb, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Star, 
  Shield,
  Navigation,
  Building,
  CheckCircle,
  Info
} from 'lucide-react';

interface LocationFinderProps {
  className?: string;
}

interface Preferences {
  transportMode: 'car' | 'public' | 'both';
  lifestyle: 'quiet' | 'lively' | 'mixed';
  familySize: number;
}

// Simple suggestion card component
function SuggestionCard({ title, content, icon: Icon }: { title: string; content: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="card-sage p-6 space-y-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="icon-circle-sage">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-darkest-green">{title}</h3>
      </div>
      <div className="text-rich-green leading-relaxed">
        {content.split('\n').map((line, index) => (
          <p key={index} className="mb-2 last:mb-0">
            {line.trim()}
          </p>
        ))}
      </div>
    </div>
  );
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-soft-sage/30 border-t-rich-green rounded-full animate-spin"></div>
        <Home className="w-6 h-6 text-rich-green absolute top-3 left-3" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-darkest-green">Finding Perfect Areas</h3>
        <p className="text-rich-green text-sm">Our AI is analyzing locations based on your preferences...</p>
      </div>
    </div>
  );
}

export default function LocationFinder({ className = '' }: LocationFinderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const [error, setError] = useState('');
  
  // Form state - simplified for better UX
  const [formData, setFormData] = useState({
    budget: '',
    workLocation: '',
    preferences: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    transportMode: 'both',
    lifestyle: 'mixed',
    familySize: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.budget || !formData.workLocation) {
      setError('Please fill in your budget and work location');
      return;
    }

    const budget = parseInt(formData.budget);
    if (isNaN(budget) || budget < 3000) {
      setError('Please enter a valid budget of at least PKR 3,000');
      return;
    }

    if (formData.workLocation.trim().length < 3) {
      setError('Please provide a more specific work location');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuggestions('');

    try {
      const requestData = {
        workplace: formData.workLocation.trim(),
        budget: budget,
        preferences: {
          description: formData.preferences || '',
          transportMode: showAdvanced ? preferences.transportMode : 'both',
          lifestyle: showAdvanced ? preferences.lifestyle : 'mixed',
          familySize: showAdvanced ? preferences.familySize : 1
        }
      };

      console.log('Sending request:', requestData); // Debug log

      const response = await fetch('/api/location-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('Response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      setSuggestions(data.suggestions || 'No suggestions available');
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unable to get location suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Parse AI suggestions into structured cards
  const parseSuggestions = (text: string) => {
    if (!text) return [];
    
    const sections = text.split('\n\n').filter(section => section.trim());
    const cards = [];
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (section) {
        let icon = MapPin;
        let title = `Recommendation ${i + 1}`;
        
        // Smart parsing for better categorization
        if (section.toLowerCase().includes('budget') || section.includes('💰') || section.toLowerCase().includes('cost') || section.toLowerCase().includes('rent')) {
          icon = DollarSign;
          title = 'Budget Analysis';
        } else if (section.toLowerCase().includes('transport') || section.includes('🚗') || section.toLowerCase().includes('commute') || section.toLowerCase().includes('metro')) {
          icon = Navigation;
          title = 'Transportation Options';
        } else if (section.toLowerCase().includes('safety') || section.includes('🛡️') || section.toLowerCase().includes('secure')) {
          icon = Shield;
          title = 'Safety & Security';
        } else if (section.toLowerCase().includes('tip') || section.includes('💡') || section.toLowerCase().includes('advice') || section.toLowerCase().includes('suggest')) {
          icon = Lightbulb;
          title = 'Expert Tips';
        } else if (section.toLowerCase().includes('area') || section.includes('📍') || section.toLowerCase().includes('location') || section.toLowerCase().includes('neighborhood')) {
          icon = Building;
          title = 'Recommended Areas';
        } else if (section.toLowerCase().includes('amenities') || section.toLowerCase().includes('facilities') || section.toLowerCase().includes('shops')) {
          icon = Star;
          title = 'Area Amenities';
        }
        
        cards.push({ title, content: section, icon });
      }
    }
    
    return cards;
  };

  const suggestionCards = parseSuggestions(suggestions);

  // Quick budget examples for better UX
  const budgetExamples = [
    { range: '15,000 - 25,000', type: 'Studio/1 Room' },
    { range: '25,000 - 40,000', type: '1-2 Bedroom' },
    { range: '40,000 - 60,000', type: '2-3 Bedroom' },
    { range: '60,000+', type: 'Premium/Family' }
  ];

  return (
    <div className={`max-w-5xl mx-auto space-y-8 px-4 ${className}`}>
      {/* Hero Section */}
    

      {/* Main Form */}
      <div className="card-mint p-8 md:p-10 space-y-8 shadow-soft">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-darkest-green">Tell Us About Your Needs</h2>
          <p className="text-rich-green">Just 3 simple questions to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Budget Input */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-lg font-semibold text-darkest-green">
                <div className="p-2 bg-rich-green/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-rich-green" />
                </div>
                Monthly Budget (PKR)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="e.g., 30000"
                className="input-sage text-lg"
                required
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                {budgetExamples.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, budget: example.range.split(' - ')[1].replace(',', '') }))}
                    className="p-2 bg-soft-sage/10 hover:bg-soft-sage/20 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-darkest-green">{example.range}</div>
                    <div className="text-rich-green/70">{example.type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Work Location */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-lg font-semibold text-darkest-green">
                <div className="p-2 bg-rich-green/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-rich-green" />
                </div>
                Work/Study Location
              </label>
              <input
                type="text"
                value={formData.workLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, workLocation: e.target.value }))}
                placeholder="e.g., Blue Area, Islamabad"
                className="input-sage text-lg"
                required
              />
              <p className="text-sm text-rich-green/70 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Include nearby landmarks for better recommendations
              </p>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-lg font-semibold text-darkest-green">
              <div className="p-2 bg-rich-green/10 rounded-lg">
                <Heart className="w-5 h-5 text-rich-green" />
              </div>
              What&apos;s Important to You?
            </label>
            <textarea
              value={formData.preferences}
              onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
              placeholder="e.g., quiet family neighborhood, close to schools, good security, markets nearby, gym access..."
              className="input-sage min-h-[120px] resize-none text-lg leading-relaxed"
              rows={4}
            />
            <div className="flex flex-wrap gap-2">
              {[
                'Family-friendly', 'Good security', 'Near schools', 'Shopping centers',
                'Quiet area', 'Public transport', 'Parks nearby', 'Gym access'
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const current = formData.preferences;
                    if (!current.includes(tag)) {
                      setFormData(prev => ({ 
                        ...prev, 
                        preferences: current ? `${current}, ${tag.toLowerCase()}` : tag.toLowerCase()
                      }));
                    }
                  }}
                  className="px-3 py-1 text-xs bg-soft-sage/20 hover:bg-soft-sage/30 text-rich-green rounded-full transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="pt-4 border-t border-soft-sage/20">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-3 text-rich-green hover:text-darkest-green transition-colors group"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              <span className="font-medium">Advanced Preferences</span>
              <span className="text-sm text-rich-green/70">(Optional)</span>
            </button>
          </div>

          {/* Advanced Preferences */}
          {showAdvanced && (
            <div className="grid md:grid-cols-3 gap-6 p-6 bg-soft-sage/10 rounded-2xl border border-soft-sage/20 animate-slide-up">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-darkest-green flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Transportation
                </label>
                <select 
                  value={preferences.transportMode}
                  onChange={(e) => setPreferences(prev => ({ ...prev, transportMode: e.target.value as 'car' | 'public' | 'both' }))}
                  className="input-sage text-sm"
                >
                  <option value="both">Car + Public Transport</option>
                  <option value="car">Own Car</option>
                  <option value="public">Public Transport Only</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-darkest-green flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Lifestyle
                </label>
                <select 
                  value={preferences.lifestyle}
                  onChange={(e) => setPreferences(prev => ({ ...prev, lifestyle: e.target.value as 'quiet' | 'lively' | 'mixed' }))}
                  className="input-sage text-sm"
                >
                  <option value="mixed">Balanced</option>
                  <option value="quiet">Quiet & Peaceful</option>
                  <option value="lively">Active & Social</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-darkest-green flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Household Size
                </label>
                <select 
                  value={preferences.familySize}
                  onChange={(e) => setPreferences(prev => ({ ...prev, familySize: parseInt(e.target.value) }))}
                  className="input-sage text-sm"
                >
                  <option value={1}>Single/Couple</option>
                  <option value={2}>Small Family (3-4)</option>
                  <option value={3}>Large Family (5+)</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-rich w-full text-lg py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Clock className="w-6 h-6 animate-spin" />
                Finding Perfect Areas...
              </>
            ) : (
              <>
                <Search className="w-6 h-6" />
                Get My Location Recommendations
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card-sage">
          <LoadingSpinner />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-center gap-4 shadow-soft">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Oops! Something went wrong</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {suggestionCards.length > 0 && (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-rich-green/10 text-rich-green px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Analysis Complete
            </div>
            <h2 className="text-3xl font-bold text-darkest-green">Your Personalized Recommendations</h2>
            <p className="text-lg text-rich-green max-w-2xl mx-auto">
              Based on your preferences, here are the best areas tailored specifically for you:
            </p>
          </div>
          
          <div className="grid gap-6">
            {suggestionCards.map((card, index) => (
              <SuggestionCard key={index} {...card} />
            ))}
          </div>
          
          {/* Call to Action */}
    
        </div>
      )}

      {/* Educational Tips Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-8 card-sage hover:shadow-lg transition-all duration-300">
          <div className="icon-circle-sage mx-auto mb-4">
            <MapPin className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-darkest-green mb-3">Location Strategy</h3>
          <p className="text-rich-green leading-relaxed">
            Choose areas within 30 minutes of your workplace. Consider future development plans and property value trends.
          </p>
        </div>
        
        <div className="text-center p-8 card-sage hover:shadow-lg transition-all duration-300">
          <div className="icon-circle-sage mx-auto mb-4">
            <DollarSign className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-darkest-green mb-3">Smart Budgeting</h3>
          <p className="text-rich-green leading-relaxed">
            Follow the 30% rule: housing shouldn&apos;t exceed 30% of income. Factor in utilities, maintenance, and transport costs.
          </p>
        </div>
        
        <div className="text-center p-8 card-sage hover:shadow-lg transition-all duration-300">
          <div className="icon-circle-sage mx-auto mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-darkest-green mb-3">Community Matters</h3>
          <p className="text-rich-green leading-relaxed">
            Visit potential areas at different times. Check local amenities, safety, and community vibe before deciding.
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-6 text-sm text-rich-green/70">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>AI-Powered Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>Trusted by 10,000+ Users</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>100% Free Service</span>
          </div>
        </div>
      </div>
    </div>
  );
}
