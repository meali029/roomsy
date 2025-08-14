// src/components/shared/RoomsyLoader.tsx

interface RoomsyLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  text?: string
}

export default function RoomsyLoader({ 
  size = 'md', 
  showText = true, 
  text = 'Loading...' 
}: RoomsyLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Roomsy Logo Animation */}
      <div className="relative roomsy-float">
        {/* Outer rotating ring */}
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 border-4 border-primary-100 rounded-full animate-spin roomsy-glow">
            <div className="w-2 h-2 bg-primary-500 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
          </div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-2 bg-primary-500 rounded-full roomsy-pulse flex items-center justify-center">
            <div className="text-white font-bold text-xs">R</div>
          </div>
          
          {/* Secondary rotating ring */}
          <div className="absolute inset-1 border-2 border-secondary-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}>
            <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full absolute -top-0.5 right-2 transform translate-x-1/2"></div>
          </div>
        </div>
        
        {/* Floating dots */}
        <div className="absolute -top-2 -left-2 w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-secondary-300 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Loading text */}
      {showText && (
        <div className="mt-6 text-center">
          <h3 className={`font-semibold text-neutral-800 ${textSizeClasses[size]} mb-2`}>
            Roomsy.pk
          </h3>
          <p className={`text-neutral-600 ${textSizeClasses[size]} animate-pulse`}>
            {text}
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-1 mt-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Full-screen loading component
export function RoomsyFullScreenLoader({ text = 'Loading your perfect match...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-neutral-50 flex items-center justify-center z-50">
      <div className="text-center relative">
        <RoomsyLoader size="xl" text={text} />
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500 rounded-full blur-3xl roomsy-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary-500 rounded-full blur-3xl roomsy-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-300 rounded-full blur-2xl roomsy-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Roomsy branding */}
        <div className="mt-8">
          <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase">
            Powered by Roomsy.pk
          </p>
        </div>
      </div>
    </div>
  )
}

// Page section loader
export function RoomsyPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="section-spacing container-spacing max-w-7xl mx-auto">
      <div className="flex items-center justify-center min-h-[400px]">
        <RoomsyLoader size="lg" text={text} />
      </div>
    </div>
  )
}
