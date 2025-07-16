import { useEffect, useRef } from "react";

function AnimatedSphere() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-2xl animate-pulse">
        <div className="w-full h-full bg-gradient-to-tr from-transparent via-blue-300 to-transparent rounded-full animate-spin-slow opacity-60"></div>
      </div>
    </div>
  );
}

function FloatingRings() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="w-64 h-64 border-4 border-purple-500 rounded-full animate-spin-slow opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-emerald-500 rounded-full animate-spin-reverse opacity-20"></div>
    </div>
  );
}

function StarField() {
  const starsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;
    
    // Create stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'absolute bg-white rounded-full animate-pulse';
      star.style.width = Math.random() * 3 + 1 + 'px';
      star.style.height = star.style.width;
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 2 + 's';
      star.style.animationDuration = Math.random() * 3 + 2 + 's';
      container.appendChild(star);
    }
    
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);
  
  return <div ref={starsRef} className="absolute inset-0 overflow-hidden"></div>;
}

const Hero3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <StarField />
      <FloatingRings />
      <AnimatedSphere />
    </div>
  );
};

export default Hero3D;
