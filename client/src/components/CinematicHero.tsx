import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'wouter';

export default function CinematicHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    setIsLoaded(true);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-space-900/95 to-space-900">
      {/* Enhanced cosmic background with stars */}
      <div className="absolute inset-0">
        {/* Animated stars */}
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
        
        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            style={{
              width: `${50 + Math.random() * 100}px`,
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 60}%`,
              transform: 'rotate(-30deg)',
              animation: `shootingStar ${3 + Math.random() * 4}s ease-out infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced film grain overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-multiply">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
            animation: 'filmGrain 0.5s steps(10) infinite',
          }}
        />
      </div>

      {/* Enhanced dramatic lighting system */}
      <div className="absolute inset-0">
        {/* Main interactive spotlight */}
        <div 
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(ellipse ${500 + mousePosition.x * 3}px ${700 + mousePosition.y * 3}px at ${50 + (mousePosition.x - 50) * 0.4}% ${50 + (mousePosition.y - 50) * 0.4}%, 
              rgba(59, 130, 246, 0.25) 0%, 
              rgba(139, 92, 246, 0.15) 20%, 
              rgba(6, 182, 212, 0.1) 40%, 
              rgba(0, 0, 0, 0.7) 65%, 
              rgba(0, 0, 0, 0.9) 100%)`,
            transition: 'background 0.2s ease-out',
          }}
        />

        {/* Volumetric atmosphere lights */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-full h-full"
            style={{
              background: `conic-gradient(from ${mousePosition.x * 3.6}deg at 50% 50%, 
                transparent 0deg, 
                rgba(59, 130, 246, 0.1) 60deg, 
                transparent 120deg, 
                rgba(139, 92, 246, 0.08) 180deg, 
                transparent 240deg, 
                rgba(6, 182, 212, 0.06) 300deg, 
                transparent 360deg)`,
              animation: 'rotateLight 20s linear infinite',
            }}
          />
        </div>

        {/* Enhanced rim lighting */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-400/40 to-transparent blur-sm" />
          <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-400/40 to-transparent blur-sm" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent blur-sm" />
        </div>

        {/* Enhanced volumetric light beams */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full opacity-15"
              style={{
                width: `${2 + Math.random()}px`,
                left: `${5 + i * 8}%`,
                background: `linear-gradient(180deg, 
                  ${i % 3 === 0 ? 'rgba(59, 130, 246, 0.4)' : 
                    i % 3 === 1 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(6, 182, 212, 0.3)'} 0%, 
                  transparent 40%, 
                  ${i % 2 === 0 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)'} 100%)`,
                transform: `skewX(${-15 + Math.sin(Date.now() * 0.001 + i) * 8}deg)`,
                animation: `lightBeam ${2 + i * 0.3}s ease-in-out infinite alternate`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>

        {/* Enhanced floating particles system */}
        <div className="absolute inset-0">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-40"
              style={{
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: i % 4 === 0 ? '#3b82f6' : 
                                i % 4 === 1 ? '#8b5cf6' : 
                                i % 4 === 2 ? '#06b6d4' : '#ffffff',
                animation: `floatParticle ${8 + Math.random() * 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>

        {/* Atmospheric depth layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`max-w-5xl mx-auto transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Cinematic title sequence */}
            <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
              {/* Main title with dramatic entrance */}
              <h1 
                className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight px-4 sm:px-0"
                style={{
                  animation: 'titleReveal 2s ease-out 0.5s both',
                }}
              >
                <span className="block text-white mb-2 sm:mb-4 drop-shadow-2xl">
                  Everything Science
                </span>
                <span 
                  className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
                  }}
                >
                  for your future
                </span>
              </h1>
              
              {/* Description with typewriter effect */}
              <p 
                className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0"
                style={{
                  animation: 'fadeInUp 1.5s ease-out 1.5s both',
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
                animation: 'fadeInUp 1s ease-out 2s both',
              }}
            >
              <Link href="/courses">
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 hover:bg-pos-100 text-white font-semibold px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl group transition-all duration-500 shadow-2xl hover:shadow-blue-500/50 border border-blue-400/20 w-full sm:w-auto"
                  style={{
                    boxShadow: '0 0 40px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span className="relative z-10">Begin Your Journey</span>
                  <ArrowRight className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-slate-400/30 text-white hover:bg-slate-800/30 backdrop-blur-md px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl group transition-all duration-300 hover:border-blue-400/50 w-full sm:w-auto"
                onClick={() => {
                  document.querySelector('#video-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                }}
              >
                <Play className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:scale-125 transition-transform duration-300" />
                Experience Preview
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