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
  const planetRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const planetScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.9]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-900 via-space-800 to-space-900 opacity-90" />
      
      {/* Large orbiting planet */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotate: planetRotation }}
      >
        <div className="relative">
          {/* Orbit ring - much larger */}
          <div className="absolute w-[150vw] h-[150vw] border border-cosmic-blue opacity-10 rounded-full" 
               style={{ top: '-75vw', left: '-75vw' }} />
          
          {/* Large Planet */}
          <motion.div
            className="absolute w-32 h-32 bg-gradient-to-br from-cosmic-blue via-cosmic-purple to-cosmic-orange rounded-full shadow-2xl"
            style={{ 
              top: '-64px', 
              left: '75vw',
              boxShadow: '0 0 80px rgba(59, 130, 246, 0.8), 0 0 120px rgba(147, 51, 234, 0.4)',
              scale: planetScale
            }}
          >
            {/* Planet surface details */}
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue to-cosmic-purple rounded-full animate-pulse opacity-60" />
            <div className="absolute inset-2 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full" />
            <div className="absolute top-4 left-4 w-4 h-4 bg-white/30 rounded-full blur-sm" />
            <div className="absolute bottom-6 right-6 w-6 h-6 bg-cosmic-orange/40 rounded-full blur-sm" />
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
            className="absolute w-48 h-48 bg-gradient-radial from-cosmic-blue/20 via-cosmic-purple/10 to-transparent rounded-full blur-3xl"
            style={{ 
              top: '-96px', 
              left: 'calc(75vw - 96px)',
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