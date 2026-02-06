import React, { useEffect, useRef } from 'react';

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
    color: string;
    twinkleSpeed: number;
    twinklePhase: number;
}

interface ShootingStar {
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    opacity: number;
    active: boolean;
}

const StarfieldBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const shootingStarRef = useRef<ShootingStar | null>(null);
    const animationFrameRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });
    const targetMouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let cx = 0;
        let cy = 0;

        // Configuration
        const STAR_COUNT = 1000;
        const SPEED = 0.8; // Slower, majestic speed
        const COLORS = ["#ffffff", "#ffe9c4", "#d4fbff", "#e6e6fa", "#fff0f5", "#8a2be2"];

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
                x: (Math.random() - 0.5) * width * 3,
                y: (Math.random() - 0.5) * height * 3,
                z: randomZ ? Math.random() * width : width,
                size: Math.random() * 1.5,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                twinkleSpeed: 0.02 + Math.random() * 0.03,
                twinklePhase: Math.random() * Math.PI * 2,
            };
        };

        const createShootingStar = (): ShootingStar => {
            // Start from a random edge
            const startX = Math.random() * width;
            const startY = Math.random() * height * 0.5; // Top half mostly
            return {
                x: startX,
                y: startY,
                length: 100 + Math.random() * 80,
                speed: 15 + Math.random() * 10,
                angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1), // Roughly diagonal down-right
                opacity: 1,
                active: true
            };
        };

        const update = () => {
            // Smooth mouse movement (Lerp)
            mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

            const parallaxX = (mouseRef.current.x - cx) * 0.02;
            const parallaxY = (mouseRef.current.y - cy) * 0.02;

            // Update Stars
            starsRef.current.forEach(star => {
                // Move star closer
                star.z -= SPEED;

                // Reset if it passes the screen
                if (star.z <= 0) {
                    Object.assign(star, createStar(false));
                }
            });

            // Update Shooting Star
            if (shootingStarRef.current && shootingStarRef.current.active) {
                const s = shootingStarRef.current;
                s.x += Math.cos(s.angle) * s.speed;
                s.y += Math.sin(s.angle) * s.speed;
                s.opacity -= 0.01;

                if (s.opacity <= 0 || s.x > width || s.y > height) {
                    shootingStarRef.current.active = false;
                    shootingStarRef.current = null;
                }
            } else {
                // Random chance to spawn a new shooting star (approx every 3-5 seconds)
                if (Math.random() < 0.003) {
                    shootingStarRef.current = createShootingStar();
                }
            }
        };

        const draw = () => {
            if (!ctx) return;

            // Clear with slight fade for trails (optional, using solid clear for sharpness)
            ctx.clearRect(0, 0, width, height);

            // Draw background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#050510');
            gradient.addColorStop(1, '#0a0a2e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            const time = Date.now() * 0.001;
            const parallaxX = (mouseRef.current.x - cx) * 0.5;
            const parallaxY = (mouseRef.current.y - cy) * 0.5;

            // Draw Stars
            starsRef.current.forEach(star => {
                const k = 128.0 / star.z;
                const px = (star.x + parallaxX) * k + cx;
                const py = (star.y + parallaxY) * k + cy;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    const scale = (1 - star.z / width);
                    const size = star.size * (scale * 3);

                    // Twinkle logic
                    const twinkle = Math.sin(time * 2 + star.twinklePhase) * 0.3 + 0.7;

                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fillStyle = star.color;
                    ctx.globalAlpha = scale * twinkle;
                    ctx.fill();
                }
            });

            // Draw Shooting Star
            if (shootingStarRef.current && shootingStarRef.current.active) {
                const s = shootingStarRef.current;
                const endX = s.x - Math.cos(s.angle) * s.length;
                const endY = s.y - Math.sin(s.angle) * s.length;

                const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
                grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
                grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.stroke();

                // Glowing head
                ctx.beginPath();
                ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
                ctx.fill();

                // Glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = "white";
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            ctx.globalAlpha = 1.0;
        };

        const animate = () => {
            update();
            draw();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseRef.current = { x: e.clientX, y: e.clientY };
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
            className="fixed inset-0 pointer-events-none z-[-1]"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default StarfieldBackground;