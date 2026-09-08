import React, { useEffect, useRef } from 'react';

export const FuturisticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    // Particle system for luxury gold dust
    const particleCount = Math.min(45, Math.floor(width / 35));
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.1),
      opacity: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    // Ambient light orbs
    const orbs = [
      { x: width * 0.2, y: height * 0.25, r: 280, color: 'rgba(212, 175, 55, 0.035)' },
      { x: width * 0.8, y: height * 0.65, r: 350, color: 'rgba(197, 159, 45, 0.03)' },
      { x: width * 0.5, y: height * 0.9, r: 300, color: 'rgba(230, 202, 101, 0.025)' },
    ];

    let t = 0;

    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background ambient light orbs
      orbs.forEach((orb, i) => {
        const ox = orb.x + Math.sin(t + i) * 30;
        const oy = orb.y + Math.cos(t * 0.8 + i) * 30;
        const grad = ctx.createRadialGradient(ox, oy, 10, ox, oy, orb.r);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Interactive mouse glass spotlight
      if (mouseRef.current.active) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const mouseGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 320);
        mouseGrad.addColorStop(0, 'rgba(212, 175, 55, 0.055)');
        mouseGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.018)');
        mouseGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mx, my, 320, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw luxury floating gold dust particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.pulseSpeed;

        // Reset if float off top
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.7 + Math.sin(p.angle) * 0.3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 222, 136, ${currentOpacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
