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

  // Create floating particles
  const particles: FloatingParticle[] = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    delay: Math.random() * 10,
    duration: Math.random() * 20 + 10,
  }));

  // Create nebula clouds
  const nebulaClouds = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * 120 - 10,
    y: Math.random() * 120 - 10,
    size: Math.random() * 400 + 200,
    opacity: Math.random() * 0.3 + 0.1,
    delay: Math.random() * 5,
    duration: Math.random() * 30 + 20,
  }));

  // Scroll-based transformations
  const rotateBackground = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scaleNebula = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-900 via-space-800 to-space-900 opacity-80" />
      
      {/* Nebula clouds */}
      <motion.div
        style={{ rotate: rotateBackground, scale: scaleNebula }}
        className="absolute inset-0"
      >
        {nebulaClouds.map((cloud, i) => (
          <motion.div
            key={`nebula-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              width: `${cloud.size}px`,
              height: `${cloud.size}px`,
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(147, 51, 234, 0.1) 40%, transparent 70%)'
                : 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)',
              opacity: cloud.opacity,
              filter: 'blur(2px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
              opacity: [cloud.opacity, cloud.opacity * 0.5, cloud.opacity],
            }}
            transition={{
              duration: cloud.duration,
              repeat: Infinity,
              delay: cloud.delay,
              ease: "linear",
            }}
          />
        ))}
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

      {/* Cosmic energy waves */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute inset-0 rounded-full border border-cosmic-blue opacity-20"
            style={{
              borderWidth: '1px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [0.5, 2, 0.5],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle orbital rings */}
      <motion.div
        style={{ rotate: rotateBackground }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {[300, 500, 700].map((size, i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute rounded-full border border-white opacity-10"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderWidth: '1px',
              borderStyle: 'dashed',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 60 + i * 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>

      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
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
            delay: i * 8 + Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default CosmicBackground;