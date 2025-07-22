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

  // Smooth continuous rotation and consistent size
  const planetRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const planetScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.5, 1.8, 1.5]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-900 via-space-800 to-space-900 opacity-90" />
      
      {/* Fixed half-orbit on right side */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Enhanced orbit ring - matching new planet position */}
          <div className="absolute w-[70vw] h-[70vw] border-2 border-orange-400 opacity-50 rounded-full" 
               style={{ 
                 top: '40%', 
                 right: '-5%',
                 transform: 'translate(35%, -50%)',
                 clipPath: 'inset(0 60% 0 0)',
                 filter: 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.3))'
               }} />
          
          {/* Enhanced TRAPPIST-1 Planet - Larger and Smoother Animation */}
          <motion.div
            className="absolute w-64 h-64 rounded-full shadow-2xl z-10"
            style={{ 
              top: '40%',
              right: '15%',
              transform: 'translate(50%, -50%)',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ff4500 50%, #dc2626 75%, #991b1b 100%)',
              boxShadow: `
                0 0 120px rgba(255, 107, 53, 1.0),
                0 0 200px rgba(255, 107, 53, 0.6),
                inset -15px -15px 35px rgba(0, 0, 0, 0.5),
                inset 8px 8px 20px rgba(255, 255, 255, 0.2)
              `,
              scale: planetScale
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              rotate: { duration: 60, repeat: Infinity, ease: "linear" }
            }}
          >
            {/* Enhanced Planet surface with realistic details */}
            <div className="absolute inset-0 rounded-full border-4 border-orange-400/50" 
                 style={{ 
                   background: 'radial-gradient(circle at 30% 30%, rgba(255, 140, 100, 0.7), transparent 70%)',
                   animation: 'pulse 4s ease-in-out infinite'
                 }} />
            
            {/* Enhanced surface features - bigger and more detailed for larger planet */}
            <div className="absolute top-16 left-20 w-16 h-20 bg-orange-700 rounded-full blur-sm opacity-80" />
            <div className="absolute bottom-20 right-24 w-20 h-16 bg-red-800 rounded-full blur-sm opacity-70" />
            <div className="absolute top-24 right-16 w-12 h-12 bg-yellow-600 rounded-full blur-sm opacity-60" />
            <div className="absolute bottom-16 left-24 w-14 h-14 bg-orange-900 rounded-full blur-sm opacity-50" />
            <div className="absolute top-32 left-12 w-10 h-12 bg-red-900 rounded-full blur-sm opacity-60" />
            <div className="absolute bottom-12 right-12 w-12 h-10 bg-orange-600 rounded-full blur-sm opacity-70" />
            <div className="absolute top-8 right-32 w-8 h-10 bg-yellow-700 rounded-full blur-sm opacity-65" />
            <div className="absolute bottom-32 left-8 w-10 h-8 bg-red-700 rounded-full blur-sm opacity-55" />
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
      
      {/* Enhanced Planet with smooth atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          {/* Larger atmospheric glow */}
          <motion.div
            className="absolute w-80 h-80 rounded-full blur-3xl"
            style={{ 
              top: '40%',
              right: '15%',
              transform: 'translate(50%, -50%)',
              background: 'radial-gradient(circle, rgba(255, 107, 53, 0.6), rgba(255, 107, 53, 0.3), transparent)',
              scale: planetScale
            }}
            animate={{
              rotate: 360,
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
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