import React, { useEffect, useRef } from 'react';

interface Star {
    x: number;
    y: number;
    z: number;
    px: number;
    py: number;
    size: number;
    color: string;
}

const StarfieldBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const animationFrameRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let cx = 0;
        let cy = 0;

        const STAR_COUNT = 800;
        const SPEED = 0.5;
        const COLORS = ["#ffffff", "#ffe9c4", "#d4fbff"]; // White, warm white, blueish white

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            cx = width / 2;
            cy = height / 2;
            initStars();
        };

        const initStars = () => {
            starsRef.current = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                starsRef.current.push(createStar());
            }
        };

        const createStar = (randomZ = true): Star => {
            return {
                x: (Math.random() - 0.5) * width * 2,
                y: (Math.random() - 0.5) * height * 2,
                z: randomZ ? Math.random() * width : width, // Start far away if not random
                px: 0,
                py: 0,
                size: Math.random(),
                color: COLORS[Math.floor(Math.random() * COLORS.length)]
            };
        };

        const updateStars = () => {
            // Mouse interaction offset
            const mx = (mouseRef.current.x - cx) * 0.05;
            const my = (mouseRef.current.y - cy) * 0.05;

            starsRef.current.forEach(star => {
                // Move star closer
                star.z -= SPEED + (200 / (star.z + 1)); // Acceleration effect

                // Reset if passes screen
                if (star.z <= 0) {
                    Object.assign(star, createStar(false));
                }

                // Project 3D coordinates to 2D screen
                const k = 128.0 / star.z;
                star.px = (star.x + mx * (width - star.z)) * k + cx;
                star.py = (star.y + my * (width - star.z)) * k + cy;

                // Culling
                if (star.px < 0 || star.px > width || star.py < 0 || star.py > height) {
                    // Optionally reset immediately to keep density high
                    // Object.assign(star, createStar(false));
                }
            });
        };

        const drawStars = () => {
            if (!ctx) return;
            // Clear with transparent fade for trail effect if desired, or solid clear
            ctx.clearRect(0, 0, width, height);

            starsRef.current.forEach(star => {
                // Determine size and opacity based on distance (z)
                const scale = (1 - star.z / width);
                const size = star.size * (scale * 3);
                const opacity = scale;

                if (star.px >= 0 && star.px <= width && star.py >= 0 && star.py <= height) {
                    ctx.fillStyle = star.color;
                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.arc(star.px, star.py, size > 0 ? size : 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.globalAlpha = 1.0;
        };

        const animate = () => {
            updateStars();
            drawStars();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        handleResize(); // Init
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[-1] bg-gradient-to-b from-[#0a0a2a] via-[#1a1a4a] to-[#0a0a2a]"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default StarfieldBackground;
