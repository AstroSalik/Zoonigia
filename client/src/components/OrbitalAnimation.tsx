import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FloatingParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

const CosmicBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Create floating particles (reduced)
  const particles: FloatingParticle[] = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.4 + 0.2,
    delay: Math.random() * 10,
    duration: Math.random() * 20 + 10,
  }));

  // Scroll-based transformations
  const planetRotation = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const planetScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-900 via-space-800 to-space-900 opacity-90" />
      
      {/* Large orbiting planet */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotate: planetRotation }}
      >
        {/* Test static planet to ensure visibility */}
        <div className="absolute w-32 h-32 bg-red-500 rounded-full top-10 left-10 z-50" />
        
        <div className="relative">
          {/* Orbit ring - visible arc from left to right */}
          <div className="absolute w-[100vw] h-[100vw] border border-cosmic-blue opacity-20 rounded-full" 
               style={{ top: '-50vw', left: '-20vw' }} />
          
          {/* Large Planet - positioned to be visible */}
          <motion.div
            className="absolute w-48 h-48 bg-gradient-to-br from-cosmic-blue via-cosmic-purple to-cosmic-orange rounded-full shadow-2xl z-10"
            style={{ 
              top: '-96px', 
              left: '50vw',
              boxShadow: '0 0 120px rgba(59, 130, 246, 0.9), 0 0 180px rgba(147, 51, 234, 0.5)',
              scale: planetScale
            }}
          >
            {/* Planet surface details */}
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue to-cosmic-purple rounded-full animate-pulse opacity-50" />
            <div className="absolute inset-4 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-full" />
            <div className="absolute top-8 left-8 w-8 h-8 bg-white/40 rounded-full blur-sm" />
            <div className="absolute bottom-12 right-12 w-12 h-12 bg-cosmic-orange/50 rounded-full blur-sm" />
            <div className="absolute top-16 right-16 w-6 h-6 bg-cosmic-purple/60 rounded-full blur-sm" />
            <div className="absolute bottom-8 left-16 w-4 h-4 bg-cosmic-yellow/50 rounded-full blur-sm" />
          </motion.div>
        </div>
      </motion.div>

      {/* Floating particles/stars */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.5)`,
            }}
            animate={{
              opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity],
              scale: [1, 1.5, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Planet glow effect */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ rotate: planetRotation }}
      >
        <div className="relative">
          <motion.div
            className="absolute w-80 h-80 bg-gradient-radial from-cosmic-blue/30 via-cosmic-purple/15 to-transparent rounded-full blur-3xl"
            style={{ 
              top: '-160px', 
              left: 'calc(50vw - 160px)',
              scale: planetScale
            }}
          />
        </div>
      </motion.div>

      {/* Shooting stars */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`shooting-star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
          }}
          animate={{
            x: [0, 200],
            y: [0, 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 12 + Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default CosmicBackground;