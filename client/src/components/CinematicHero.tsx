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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-slate-900 to-black">
      {/* Elegant floating orbs background */}
      <div className="absolute inset-0">
        {/* Large ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        
        {/* Smaller accent orbs */}
        <div className="absolute top-1/2 left-1/6 w-32 h-32 bg-indigo-500/12 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 left-2/3 w-40 h-40 bg-violet-500/8 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }} />
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            
            {/* Cinematic title sequence */}
            <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
              {/* Main title with dramatic entrance */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight px-4 sm:px-0">
                <span 
                  className="block text-white mb-2 sm:mb-4 animate-slide-up"
                  style={{ 
                    animationDelay: '0.3s',
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.2)'
                  }}
                >
                  Everything Science
                </span>
                <span 
                  className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-slide-up animate-glow"
                  style={{ 
                    animationDelay: '0.6s',
                    filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))'
                  }}
                >
                  for your future
                </span>
              </h1>
              
              {/* Description with typewriter effect */}
              <p 
                className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0 animate-slide-up"
                style={{ 
                  animationDelay: '0.9s',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                }}
              >
                Enter a world where quantum mysteries unfold, cosmic secrets reveal themselves, 
                and the future of science begins with your journey.
              </p>
            </div>

            {/* CTA Buttons with cinematic entrance */}
            <div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0 animate-slide-up"
              style={{ animationDelay: '1.2s' }}
            >
              <Link href="/courses">
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl group transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/30 w-full sm:w-auto overflow-hidden hover:scale-105"
                  style={{
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="relative z-10">Begin Your Journey</span>
                  <ArrowRight className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="relative border-2 border-slate-400/60 text-white hover:bg-slate-800/40 backdrop-blur-sm px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl group transition-all duration-500 hover:border-blue-400/80 w-full sm:w-auto overflow-hidden hover:scale-105"
                onClick={() => {
                  document.querySelector('#video-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  boxShadow: '0 4px 20px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <Play className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:scale-125 transition-transform duration-300 relative z-10" />
                <span className="relative z-10">Experience Preview</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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