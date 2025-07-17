import React, { useRef } from 'react';
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
  const particles: FloatingParticle[] = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.4 + 0.2,
    delay: Math.random() * 10,
    duration: Math.random() * 20 + 10,
  }));

  // Scroll-based transformations - reversed direction
  const planetRotation = useTransform(scrollYProgress, [0, 1], [180, 0]);
  const planetScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-900 via-space-800 to-space-900 opacity-90" />
      
      {/* Fixed half-orbit on right side */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Half orbit ring - fixed position, curved left side */}
          <div className="absolute w-[60vw] h-[60vw] border-2 border-orange-400 opacity-40 rounded-full" 
               style={{ 
                 top: '50%', 
                 right: '0%',
                 transform: 'translate(30%, -50%)',
                 clipPath: 'inset(0 50% 0 0)'
               }} />
          
          {/* TRAPPIST-1 Planet orbiting the half-orbit */}
          <motion.div
            className="absolute w-44 h-44 rounded-full shadow-2xl z-10"
            style={{ 
              top: '50%',
              right: '30vw',
              transform: 'translate(50%, -50%)',
              transformOrigin: '30vw 0',
              rotate: planetRotation,
              background: 'radial-gradient(circle at 30% 30%, #ff6b35, #d84315, #8b2500)',
              boxShadow: '0 0 80px rgba(255, 107, 53, 0.9), inset -10px -10px 25px rgba(0, 0, 0, 0.4)',
              scale: planetScale
            }}
          >
            {/* Planet surface with realistic details */}
            <div className="absolute inset-0 rounded-full" 
                 style={{ 
                   background: 'radial-gradient(circle at 25% 25%, rgba(255, 140, 100, 0.5), transparent 60%)',
                 }} />
            {/* Continents and surface features - scaled for bigger planet */}
            <div className="absolute top-8 left-10 w-8 h-10 bg-orange-700 rounded-full blur-sm opacity-80" />
            <div className="absolute bottom-10 right-12 w-10 h-8 bg-red-800 rounded-full blur-sm opacity-70" />
            <div className="absolute top-12 right-8 w-6 h-6 bg-yellow-600 rounded-full blur-sm opacity-60" />
            <div className="absolute bottom-8 left-12 w-7 h-7 bg-orange-900 rounded-full blur-sm opacity-50" />
          </motion.div>
        </div>
      </div>

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
      
      {/* Planet atmospheric glow following orbit */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          <motion.div
            className="absolute w-56 h-56 rounded-full blur-3xl"
            style={{ 
              top: '50%',
              right: '30vw',
              transform: 'translate(50%, -50%)',
              transformOrigin: '30vw 0',
              rotate: planetRotation,
              background: 'radial-gradient(circle, rgba(255, 107, 53, 0.4), rgba(255, 107, 53, 0.2), transparent)',
              scale: planetScale
            }}
          />
        </div>
      </div>

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