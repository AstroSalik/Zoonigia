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
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Large background image - SpaceX style */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='space' cx='50%25' cy='30%25' r='60%25'%3E%3Cstop offset='0%25' style='stop-color:%23001122;stop-opacity:1' /%3E%3Cstop offset='40%25' style='stop-color:%23000815;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23000000;stop-opacity:1' /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23space)' /%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Subtle star field */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-60"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Clean overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Main content - SpaceX style layout */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            
            {/* Clean, bold title - SpaceX style */}
            <div className="space-y-8 mb-12">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none text-white animate-slide-up">
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
              
              {/* Clean description */}
              <p 
                className="text-xl lg:text-2xl text-gray-400 max-w-2xl leading-relaxed animate-slide-up"
                style={{ animationDelay: '0.6s' }}
              >
                Enter a world where quantum mysteries unfold, cosmic secrets reveal themselves, 
                and the future of science begins with your journey.
              </p>
            </div>

            {/* Clean SpaceX-style button */}
            <div 
              className="flex gap-6 animate-slide-up"
              style={{ animationDelay: '0.8s' }}
            >
              <Link href="/courses">
                <Button 
                  size="lg" 
                  className="bg-white text-black font-semibold px-12 py-4 text-lg hover:bg-gray-100 transition-all duration-300 border-0 rounded-none"
                >
                  Begin Your Journey
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="lg"
                className="text-white font-semibold px-8 py-4 text-lg hover:bg-white/10 transition-all duration-300 border-0 rounded-none"
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
      </div>

      {/* Minimal scroll indicator - SpaceX style */}
      <div 
        className={`absolute bottom-12 left-6 lg:left-12 transition-opacity duration-500 ${
          scrollY > 100 ? 'opacity-0' : 'opacity-60'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-px bg-white/60"></div>
          <span className="text-white/60 text-sm font-light tracking-wider uppercase">Scroll</span>
        </div>
      </div>
    </div>
  );
}