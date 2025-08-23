'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LocationFinder from '@/components/ai/LocationFinder';

export default function LocationFinderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/login?callbackUrl=/location-finder');
      return;
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-cream via-white to-soft-sage/20 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-soft-sage/30 border-t-rich-green rounded-full animate-spin mx-auto"></div>
          <p className="text-rich-green">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect is happening)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-cream via-white to-soft-sage/20 pt-24 pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-soft-sage/20 text-rich-green px-6 py-3 rounded-full text-sm font-medium border border-soft-sage/30 mb-6">
          🧠 AI Location Intelligence
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-darkest-green mb-4">
          Smart Location Finder
        </h1>
        <p className="text-xl text-rich-green max-w-3xl mx-auto leading-relaxed">
          Get personalized area recommendations based on your workplace and budget. 
          Perfect for finding the ideal place to live in Pakistan.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <LocationFinder />
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-6 text-sm text-rich-green/70 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full border border-soft-sage/20">
          <span className="flex items-center gap-2">
            🤖 Powered by Google Gemini AI
          </span>
          <span className="flex items-center gap-2">
            🇵🇰 Specialized for Pakistan
          </span>
          <span className="flex items-center gap-2">
            🆓 Completely Free
          </span>
        </div>
      </div>
    </div>
  );
}
