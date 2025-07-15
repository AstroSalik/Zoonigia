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
      
      {/* TRAPPIST-1 style planet orbiting from left */}
      <motion.div
        className="absolute inset-0"
        style={{ rotate: planetRotation }}
      >
        <div className="relative w-full h-full">
          {/* Partial orbit ring - only showing left arc */}
          <div className="absolute w-[80vw] h-[80vw] border border-orange-400 opacity-30 rounded-full" 
               style={{ 
                 top: '50%', 
                 left: '0%',
                 transform: 'translate(-40%, -50%)'
               }} />
          
          {/* TRAPPIST-1 Planet */}
          <motion.div
            className="absolute w-28 h-28 rounded-full shadow-2xl z-10"
            style={{ 
              top: '50%',
              left: '40vw',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle at 30% 30%, #ff6b35, #d84315, #8b2500)',
              boxShadow: '0 0 60px rgba(255, 107, 53, 0.8), inset -8px -8px 20px rgba(0, 0, 0, 0.3)',
              scale: planetScale
            }}
          >
            {/* Planet surface - rocky with atmosphere */}
            <div className="absolute inset-0 rounded-full" 
                 style={{ 
                   background: 'radial-gradient(circle at 25% 25%, rgba(255, 140, 100, 0.4), transparent 50%)',
                 }} />
            {/* Continents/land masses */}
            <div className="absolute top-4 left-6 w-4 h-6 bg-orange-700 rounded-full blur-sm opacity-70" />
            <div className="absolute bottom-6 right-8 w-6 h-4 bg-red-800 rounded-full blur-sm opacity-60" />
            <div className="absolute top-8 right-4 w-3 h-3 bg-yellow-600 rounded-full blur-sm opacity-50" />
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
      
      {/* Planet atmospheric glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ rotate: planetRotation }}
      >
        <div className="relative w-full h-full">
          <motion.div
            className="absolute w-40 h-40 rounded-full blur-2xl"
            style={{ 
              top: '50%',
              left: '40vw',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255, 107, 53, 0.3), rgba(255, 107, 53, 0.1), transparent)',
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