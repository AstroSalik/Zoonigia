import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Planet {
  name: string;
  size: number;
  distance: number;
  speed: number;
  color: string;
  orbitColor: string;
}

const planets: Planet[] = [
  { name: 'Mercury', size: 8, distance: 80, speed: 4, color: '#FFC649', orbitColor: '#FFC649' },
  { name: 'Venus', size: 12, distance: 110, speed: 3, color: '#FFC649', orbitColor: '#FFC649' },
  { name: 'Earth', size: 14, distance: 140, speed: 2, color: '#6B93D6', orbitColor: '#6B93D6' },
  { name: 'Mars', size: 10, distance: 170, speed: 1.5, color: '#C1440E', orbitColor: '#C1440E' },
  { name: 'Jupiter', size: 28, distance: 220, speed: 1, color: '#D8CA9D', orbitColor: '#D8CA9D' },
  { name: 'Saturn', size: 24, distance: 270, speed: 0.8, color: '#FAD5A5', orbitColor: '#FAD5A5' },
];

const OrbitalAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateSystem = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <div ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        style={{
          rotate: rotateSystem,
          scale: scale,
          opacity: opacity,
        }}
        className="relative w-[600px] h-[600px]"
      >
        {/* Central Star */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Orbital Rings and Planets */}
        {planets.map((planet, index) => (
          <div key={planet.name} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* Orbit Ring */}
            <div
              className="absolute rounded-full border opacity-20"
              style={{
                width: `${planet.distance * 2}px`,
                height: `${planet.distance * 2}px`,
                borderColor: planet.orbitColor,
                top: `-${planet.distance}px`,
                left: `-${planet.distance}px`,
                borderWidth: '1px',
              }}
            />
            
            {/* Planet */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                backgroundColor: planet.color,
                top: `-${planet.size / 2}px`,
                left: `${planet.distance - planet.size / 2}px`,
                boxShadow: `0 0 ${planet.size}px ${planet.color}40`,
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20 / planet.speed,
                repeat: Infinity,
                ease: "linear",
              }}
              transformOrigin={`-${planet.distance - planet.size / 2}px ${planet.size / 2}px`}
            >
              {/* Planet Ring (for Saturn) */}
              {planet.name === 'Saturn' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-gray-400 rounded-full opacity-60"></div>
              )}
            </motion.div>
          </div>
        ))}

        {/* Asteroid Belt */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute rounded-full border-dashed border-gray-500 opacity-30"
            style={{
              width: '400px',
              height: '400px',
              top: '-200px',
              left: '-200px',
              borderWidth: '2px',
            }}
          />
          {/* Asteroid particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gray-400 rounded-full"
              style={{
                top: '-0.5px',
                left: `${200 - 0.5}px`,
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 30 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5,
              }}
              transformOrigin={`-${200 - 0.5}px 0.5px`}
            />
          ))}
        </div>

        {/* Cosmic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Interactive Labels */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-space-200 text-sm"
        >
          <p className="mb-2">🌟 Explore the Solar System</p>
          <p className="text-xs opacity-75">Scroll to see orbital mechanics in action</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrbitalAnimation;