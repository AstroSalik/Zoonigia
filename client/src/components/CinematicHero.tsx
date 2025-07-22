import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'wouter';

export default function CinematicHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setIsLoaded(true);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-30 mix-blend-multiply">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
            animation: 'filmGrain 0.5s steps(10) infinite',
          }}
        />
      </div>

      {/* Dramatic lighting */}
      <div className="absolute inset-0">
        {/* Main spotlight */}
        <div 
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(ellipse ${400 + mousePosition.x * 2}px ${600 + mousePosition.y * 2}px at ${50 + (mousePosition.x - 50) * 0.3}% ${50 + (mousePosition.y - 50) * 0.3}%, 
              rgba(59, 130, 246, 0.15) 0%, 
              rgba(139, 92, 246, 0.1) 30%, 
              rgba(0, 0, 0, 0.8) 60%, 
              rgba(0, 0, 0, 0.95) 100%)`,
            transition: 'background 0.3s ease-out',
          }}
        />

        {/* Side rim lighting */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent" />
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
        </div>

        {/* Volumetric light beams */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-1 h-full opacity-10"
              style={{
                left: `${10 + i * 12}%`,
                background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 100%)',
                transform: `rotate(${-2 + i * 0.5}deg) translateY(-10px)`,
                filter: 'blur(2px)',
                animation: `lightSweep ${6 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Floating dust particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatDust ${8 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`max-w-5xl mx-auto transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Cinematic title sequence */}
            <div className="space-y-8 mb-12">
              {/* Subtitle appears first */}
              <div 
                className="text-blue-300 text-lg font-medium tracking-widest uppercase opacity-80"
                style={{
                  animation: 'fadeInUp 1s ease-out 0.5s both',
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                }}
              >
                Frontier Sciences Discovery Platform
              </div>

              {/* Main title with dramatic entrance */}
              <h1 
                className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight"
                style={{
                  animation: 'titleReveal 2s ease-out 1s both',
                }}
              >
                <span className="block text-white mb-4 drop-shadow-2xl">
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
                className="text-xl sm:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
                style={{
                  animation: 'fadeInUp 1.5s ease-out 2s both',
                }}
              >
                Enter a world where quantum mysteries unfold, cosmic secrets reveal themselves, 
                and the future of science begins with your journey.
              </p>
            </div>

            {/* CTA Buttons with cinematic entrance */}
            <div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              style={{
                animation: 'fadeInUp 1s ease-out 2.5s both',
              }}
            >
              <Link href="/courses">
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 hover:bg-pos-100 text-white font-semibold px-12 py-6 text-xl group transition-all duration-500 shadow-2xl hover:shadow-blue-500/50 border border-blue-400/20"
                  style={{
                    boxShadow: '0 0 40px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span className="relative z-10">Begin Your Journey</span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-slate-400/30 text-white hover:bg-slate-800/30 backdrop-blur-md px-12 py-6 text-xl group transition-all duration-300 hover:border-blue-400/50"
                onClick={() => {
                  document.querySelector('#video-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                }}
              >
                <Play className="mr-3 h-6 w-6 group-hover:scale-125 transition-transform duration-300" />
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

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        style={{
          animation: 'fadeInUp 1s ease-out 3s both',
        }}
      >
        <div className="flex flex-col items-center space-y-3 text-slate-400 animate-pulse">
          <div className="text-sm tracking-wider">SCROLL TO DISCOVER</div>
          <div className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent" />
        </div>
      </div>
    </div>
  );
}