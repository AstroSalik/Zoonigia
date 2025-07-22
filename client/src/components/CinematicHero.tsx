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
      {/* Cosmic space background with purple/blue nebula */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 70%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 60% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, #0f0f23 0%, #1e1b4b 50%, #0f0f23 100%)
            `
          }}
        />
        
        {/* Star field */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.5 + Math.random() * 2}px`,
                height: `${0.5 + Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.4 + Math.random() * 0.6,
                animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Large astronaut figure on the right */}
      <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-end justify-center">
        <div 
          className="w-96 h-96 bg-gradient-to-t from-gray-600 via-gray-400 to-gray-300 rounded-full opacity-80"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(200, 200, 200, 0.6) 30%, rgba(100, 100, 100, 0.4) 100%),
              linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)
            `,
            transform: 'perspective(800px) rotateY(-15deg)',
            filter: 'drop-shadow(0 20px 40px rgba(147, 51, 234, 0.3))',
          }}
        />
        {/* Astronaut helmet reflection */}
        <div 
          className="absolute w-64 h-64 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 40% 30%, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
            transform: 'perspective(800px) rotateY(-15deg)',
          }}
        />
      </div>

      {/* Large title text spanning across top */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-20">
        <div className="container mx-auto px-8">
          <h1 
            className="text-8xl sm:text-9xl lg:text-[12rem] font-black leading-none text-center opacity-20 animate-slide-up"
            style={{ 
              color: 'rgba(147, 51, 234, 0.3)',
              letterSpacing: '0.2em',
              animationDelay: '0.2s'
            }}
          >
            STELLAR
          </h1>
        </div>
      </div>

      {/* Main content on left */}
      <div className="relative z-20 flex items-center min-h-screen">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="max-w-lg">
            
            {/* Main title and subtitle */}
            <div className="space-y-4 mb-8">
              <h2 className="text-3xl font-bold text-white animate-slide-up" style={{ animationDelay: '0.4s' }}>
                EXPLORING THE GALAXY
              </h2>
              
              <p 
                className="text-gray-300 leading-relaxed animate-slide-up"
                style={{ animationDelay: '0.6s' }}
              >
                We are committed to advancing the future of deep space travel to the farthest reaches of our solar system.
              </p>
            </div>

            {/* Discover button */}
            <div 
              className="animate-slide-up"
              style={{ animationDelay: '0.8s' }}
            >
              <Link href="/courses">
                <Button 
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300"
                >
                  DISCOVER
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation indicators */}
      <div className="absolute bottom-8 right-8 flex flex-col space-y-4">
        <div className="w-2 h-2 bg-white rounded-full opacity-40"></div>
        <div className="w-2 h-2 bg-white rounded-full opacity-100"></div>
        <div className="w-2 h-2 bg-white rounded-full opacity-40"></div>
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-8 right-16 text-white/60 text-sm">
        01 / 03
      </div>

      {/* Simple chevron down indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
          scrollY > 100 ? 'opacity-0' : 'opacity-60'
        }`}
      >
        <div className="text-white/60 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
}