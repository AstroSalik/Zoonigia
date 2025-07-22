import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'wouter';

export default function CinematicHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-space-900 via-space-800 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-space-900/90 via-space-800/80 to-indigo-900/90" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Main light beam */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-px h-full bg-gradient-to-t from-transparent via-blue-400/80 to-transparent"
            style={{
              boxShadow: '0 0 100px 20px rgba(59, 130, 246, 0.3)',
              transform: `translateX(${(mousePosition.x - 50) * 0.5}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
        </div>

        {/* Secondary light effects */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div 
            className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${(mousePosition.x - 50) * 0.2}px, ${(mousePosition.y - 50) * 0.2}px)`,
              transition: 'transform 0.5s ease-out',
            }}
          />
        </div>

        {/* Radial glow at bottom */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-96 h-32 bg-gradient-to-t from-blue-400/30 to-transparent blur-xl" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Main heading */}
            <div className="space-y-8 mb-12">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Everything Science
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    for your future
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-space-300 max-w-2xl leading-relaxed">
                  Zoonigia, an immersive platform, serves as an all-in-one 
                  gateway to frontier sciences, literature, and philosophy.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <Button 
                    size="lg" 
                    className="cosmic-gradient hover:opacity-90 text-white font-semibold px-8 py-4 text-lg group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25"
                  >
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg group transition-all duration-300"
                  onClick={() => {
                    document.querySelector('#video-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-blue-400 text-sm font-semibold mb-2">WORKSHOPS</div>
                <div className="text-white font-medium">Hands-on Learning</div>
                <div className="text-space-300 text-sm mt-1">Interactive sessions with real equipment</div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-purple-400 text-sm font-semibold mb-2">RESEARCH</div>
                <div className="text-white font-medium">NASA Collaboration</div>
                <div className="text-space-300 text-sm mt-1">Contribute to real space missions</div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-green-400 text-sm font-semibold mb-2">DISCOVERY</div>
                <div className="text-white font-medium">Frontier Sciences</div>
                <div className="text-space-300 text-sm mt-1">Quantum mechanics to astrophysics</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <div className="text-sm">Scroll to explore</div>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}