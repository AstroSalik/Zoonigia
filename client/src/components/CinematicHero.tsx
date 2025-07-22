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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-900">
      {/* Simple dark gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-black to-indigo-900/60" />
      </div>

      {/* Main content centered */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-6xl mx-auto px-6">
          
          {/* Main title */}
          <div className="space-y-8 mb-12">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight text-white animate-slide-up">
              <div className="mb-4" style={{ animationDelay: '0.2s' }}>
                Everything Science
              </div>
              <div 
                className="text-gray-300 animate-slide-up"
                style={{ animationDelay: '0.4s' }}
              >
                for your future
              </div>
            </h1>
            
            {/* Description */}
            <p 
              className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-slide-up"
              style={{ animationDelay: '0.6s' }}
            >
              Enter a world where quantum mysteries unfold, cosmic secrets reveal themselves, 
              and the future of science begins with your journey.
            </p>
          </div>

          {/* Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up"
            style={{ animationDelay: '0.8s' }}
          >
            <Link href="/courses">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 text-lg transition-all duration-300"
              >
                Begin Your Journey
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-400 text-white hover:bg-gray-800 px-12 py-4 text-lg transition-all duration-300"
              onClick={() => {
                document.querySelector('#video-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Play className="mr-3 h-5 w-5" />
              Watch Preview
            </Button>
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