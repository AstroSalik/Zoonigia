import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'wouter';

export default function CinematicHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    setIsLoaded(true);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Dynamic cosmic background */}
      <div className="absolute inset-0">
        {/* Elegant star field with depth */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.5 + Math.random() * 2}px`,
                height: `${0.5 + Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.7,
                animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Nebula effect */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-full h-full"
            style={{
              background: `radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(99, 102, 241, 0.15) 0%, 
                rgba(139, 92, 246, 0.1) 25%, 
                rgba(59, 130, 246, 0.08) 50%, 
                transparent 70%)`,
              transition: 'background 0.8s ease-out',
            }}
          />
        </div>

        {/* Cinematic film grain */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
            animation: 'subtleGrain 3s steps(5) infinite',
          }}
        />
      </div>

      {/* Professional lighting system */}
      <div className="absolute inset-0">
        {/* Primary spotlight */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 20%, 
              transparent 60%)`,
            transition: 'background 0.3s ease-out',
          }}
        />

        {/* Atmospheric depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        
        {/* Edge lighting */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent" />
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`max-w-5xl mx-auto transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Cinematic title sequence */}
            <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
              {/* Main title with dramatic entrance */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight px-4 sm:px-0">
                <span 
                  className="block text-white mb-2 sm:mb-4 hero-title-main"
                  style={{
                    textShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.3)',
                    animation: 'heroTitleReveal 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s both',
                  }}
                >
                  Everything Science
                </span>
                <span 
                  className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent hero-title-sub"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.4))',
                    animation: 'heroSubtitleReveal 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s both',
                  }}
                >
                  for your future
                </span>
              </h1>
              
              {/* Description with typewriter effect */}
              <p 
                className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0"
                style={{
                  textShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
                  animation: 'heroDescriptionReveal 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.8s both',
                }}
              >
                Enter a world where quantum mysteries unfold, cosmic secrets reveal themselves, 
                and the future of science begins with your journey.
              </p>
            </div>

            {/* CTA Buttons with cinematic entrance */}
            <div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0"
              style={{
                animation: 'heroButtonsReveal 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.5s both',
              }}
            >
              <Link href="/courses">
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 hover:bg-pos-100 text-white font-semibold px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl group transition-all duration-700 shadow-2xl hover:shadow-blue-500/60 border border-blue-400/30 w-full sm:w-auto overflow-hidden"
                  style={{
                    boxShadow: '0 8px 40px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <span className="relative z-10 transition-all duration-300 group-hover:scale-105">Begin Your Journey</span>
                  <ArrowRight className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-2 transition-all duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-slate-400/40 text-white hover:bg-slate-800/40 backdrop-blur-lg px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl group transition-all duration-500 hover:border-blue-400/60 w-full sm:w-auto relative overflow-hidden"
                onClick={() => {
                  document.querySelector('#video-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <Play className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:scale-125 transition-all duration-300 relative z-10" />
                <span className="relative z-10 transition-all duration-300 group-hover:scale-105">Experience Preview</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-800" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 70%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />

      {/* Scroll indicator with fade on scroll */}
      <div 
        className="fixed bottom-4 sm:bottom-8 left-0 right-0 z-10 flex justify-center transition-opacity duration-300 pointer-events-none"
        style={{
          animation: 'fadeInUp 1s ease-out 2.5s both',
          opacity: scrollY < (window.innerHeight * 0.7) ? Math.max(0, 1 - (scrollY / (window.innerHeight * 0.5))) : 0,
          visibility: scrollY < (window.innerHeight * 0.7) ? 'visible' : 'hidden',
        }}
      >
        <div className="flex flex-col items-center space-y-2 sm:space-y-3 text-slate-400 animate-pulse">
          <div className="text-xs sm:text-sm tracking-wider">SCROLL TO DISCOVER</div>
          <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-slate-400 to-transparent" />
        </div>
      </div>
    </div>
  );
}