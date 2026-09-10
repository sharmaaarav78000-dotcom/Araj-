import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { toggleAudioMute, getIsAudioMuted, playLuxuryChime } from '../utils/sound';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape: 'star' | 'circle' | 'heart' | 'sparkle';
}

interface FlyingOrb {
  id: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  progress: number;
  color: string;
}

export const ParticleBurst: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const flyingOrbsRef = useRef<FlyingOrb[]>([]);
  const [isMuted, setIsMuted] = useState(getIsAudioMuted());
  const [soundActive, setSoundActive] = useState(false);

  // Sound active pulse timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const handleSoundPlayed = () => {
      setTimeout(() => {
        setSoundActive(true);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => setSoundActive(false), 350);
      }, 0);
    };

    const handleMuteChange = (e: Event) => {
      const custom = e as CustomEvent<{ isMuted: boolean }>;
      if (custom.detail) {
        setTimeout(() => {
          setIsMuted(custom.detail.isMuted);
        }, 0);
      }
    };

    window.addEventListener('araj:sound-played', handleSoundPlayed);
    window.addEventListener('araj:mute-change', handleMuteChange);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('araj:sound-played', handleSoundPlayed);
      window.removeEventListener('araj:mute-change', handleMuteChange);
    };
  }, []);

  // Listen to particle trigger events
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const custom = e as CustomEvent<{
        x: number;
        y: number;
        type?: 'gold' | 'heart' | 'spice' | 'cart';
        targetCart?: boolean;
      }>;
      const { x, y, type = 'gold', targetCart = false } = custom.detail || {};
      if (typeof x !== 'number' || typeof y !== 'number') return;

      // Spawn particles
      const count = type === 'cart' ? 24 : type === 'heart' ? 14 : 18;
      const palette =
        type === 'heart'
          ? ['#FF4D82', '#FF6B6B', '#F5DE88', '#FFB6C1']
          : type === 'spice'
          ? ['#E69C36', '#D4AF37', '#FF7F50', '#C59F2D']
          : ['#D4AF37', '#F5DE88', '#FFF8E1', '#E6CA65', '#C59F2D'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (type === 'heart' ? 2.5 : 1.0),
          size: Math.random() * 3.5 + 1.5,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 1,
          decay: Math.random() * 0.025 + 0.018,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          shape: type === 'heart' ? 'heart' : Math.random() > 0.4 ? 'star' : 'circle',
        });
      }

      // If adding to cart, spawn a flying orb heading towards the cart button in navbar!
      if (targetCart || type === 'cart') {
        const cartBtn = document.getElementById('navbar-cart-btn') || document.getElementById('mobile-nav-cart');
        let targetX = window.innerWidth - 70;
        let targetY = 32;

        if (cartBtn) {
          const rect = cartBtn.getBoundingClientRect();
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
        }

        flyingOrbsRef.current.push({
          id: Date.now() + Math.random(),
          startX: x,
          startY: y,
          currentX: x,
          currentY: y,
          targetX,
          targetY,
          progress: 0,
          color: '#F5DE88',
        });
      }
    };

    window.addEventListener('araj:particle', handleTrigger);
    return () => window.removeEventListener('araj:particle', handleTrigger);
  }, []);

  // Animation Loop on Fullscreen Overlay Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const drawStar = (cx: number, cy: number, spikes: number, outerR: number, innerR: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerR);
      ctx.closePath();
      ctx.fill();
    };

    const drawHeart = (x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.2);
      ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & Update Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gentle gravity
        p.vx *= 0.98; // atmospheric friction
        p.alpha -= p.decay;
        p.rotation += p.vRot;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        if (p.shape === 'star') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          drawStar(0, 0, 4, p.size * 1.6, p.size * 0.6);
        } else if (p.shape === 'heart') {
          drawHeart(p.x, p.y, p.size * 1.5);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Render & Update Flying Cart Orbs
      const orbs = flyingOrbsRef.current;
      for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        orb.progress += 0.035;

        // Quadratic Bezier arc with high apex
        const t = Math.min(1, orb.progress);
        const controlX = (orb.startX + orb.targetX) / 2 - 60;
        const controlY = Math.min(orb.startY, orb.targetY) - 140;

        orb.currentX = (1 - t) * (1 - t) * orb.startX + 2 * (1 - t) * t * controlX + t * t * orb.targetX;
        orb.currentY = (1 - t) * (1 - t) * orb.startY + 2 * (1 - t) * t * controlY + t * t * orb.targetY;

        // Draw glowing golden comet tail
        ctx.save();
        ctx.beginPath();
        ctx.arc(orb.currentX, orb.currentY, 6 * (1 - t * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = '#FFF2A8';
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();

        // Secondary outer aura
        ctx.beginPath();
        ctx.arc(orb.currentX, orb.currentY, 14 * (1 - t * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.fill();
        ctx.restore();

        // Spawn mini sparkles in comet wake
        if (Math.random() > 0.4) {
          particles.push({
            x: orb.currentX + (Math.random() - 0.5) * 8,
            y: orb.currentY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2 + 1,
            color: '#F5DE88',
            alpha: 0.9,
            decay: 0.05,
            rotation: 0,
            vRot: 0,
            shape: 'circle',
          });
        }

        if (orb.progress >= 1) {
          orbs.splice(i, 1);
          playLuxuryChime('sparkle');
          // Pulse the cart icon
          const cartBtn = document.getElementById('navbar-cart-btn');
          if (cartBtn) {
            cartBtn.classList.add('scale-125');
            setTimeout(() => cartBtn.classList.remove('scale-125'), 300);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleToggleSound = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
    if (!muted) {
      playLuxuryChime('sparkle');
    }
  };

  return (
    <>
      {/* Fullscreen Overlay Canvas for Physics Particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Floating Interactive Luxury Audio FX Capsule */}
      <aside aria-label="Audio controller" className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel-gold border border-[#D4AF37]/35 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/70">
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute luxury sound chimes' : 'Mute luxury sound chimes'}
          className="flex items-center gap-2 text-xs font-semibold text-[#F5DE88] hover:text-[#FFF] transition-colors cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-[#88847A]" />
          ) : (
            <Volume2 className={`w-4 h-4 text-[#D4AF37] ${soundActive ? 'scale-125 text-[#FFF]' : ''} transition-transform`} />
          )}
          <span className="text-[10px] tracking-wider uppercase font-mono">
            {isMuted ? 'CHIMES MUTED' : 'ROYAL CHIMES ON'}
          </span>
        </button>

        {/* Live Audio Equalizer Wave Bar */}
        {!isMuted && (
          <div className="flex items-center gap-0.5 ml-1 h-3.5">
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${soundActive ? 'h-3.5' : 'h-1.5 animate-pulse'}`} />
            <span className={`w-0.5 bg-[#F5DE88] rounded-full transition-all duration-150 ${soundActive ? 'h-4' : 'h-2 animate-pulse delay-75'}`} />
            <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${soundActive ? 'h-3' : 'h-1 animate-pulse delay-150'}`} />
          </div>
        )}
      </aside>
    </>
  );
};
