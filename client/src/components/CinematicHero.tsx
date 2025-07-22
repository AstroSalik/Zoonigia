import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'wouter';

export default function CinematicHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      {/* Dark space background with nebula effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-slate-900/60 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Dramatic vertical light beam - center focal point */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-2 h-full bg-gradient-to-b from-transparent via-blue-300 to-transparent opacity-80"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(147, 197, 253, 0.4) 20%, rgba(59, 130, 246, 0.8) 50%, rgba(147, 197, 253, 0.4) 80%, transparent 100%)',
            filter: 'blur(1px)',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.3)',
          }}
        />
        <div 
          className="absolute w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-90"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.3) 30%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.3) 70%, transparent 100%)',
            filter: 'blur(0.5px)',
          }}
        />
      </div>

      {/* Subtle atmospheric glow around the beam */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-32 h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"
          style={{
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Main content - positioned on left like in image */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="max-w-2xl">
            
            {/* Large bold title exactly like image */}
            <div className="space-y-6 mb-10">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white animate-slide-up">
                <div className="mb-2" style={{ animationDelay: '0.2s' }}>
                  Everything Science
                </div>
                <div 
                  className="animate-slide-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  for your future
                </div>
              </h1>
              
              {/* Description exactly like image */}
              <p 
                className="text-lg text-gray-300 max-w-lg leading-relaxed animate-slide-up"
                style={{ animationDelay: '0.6s' }}
              >
                Zoonigia, an innovative platform, serves as an all-in-one 
                gateway for frontier sciences discovery and exploration.
              </p>
            </div>

            {/* Rounded button exactly like image */}
            <div 
              className="animate-slide-up"
              style={{ animationDelay: '0.8s' }}
            >
              <Link href="/courses">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium px-8 py-4 text-base rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  TRY IT FREE
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Simple scroll indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
          scrollY > 100 ? 'opacity-0' : 'opacity-60'
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/60 text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}