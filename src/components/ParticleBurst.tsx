import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles, ChevronRight, ChevronLeft, Sliders, Check } from 'lucide-react';
import { 
  toggleAudioMute, 
  getIsAudioMuted, 
  playLuxuryChime, 
  playSlideSound, 
  getSlideSoundStyle, 
  setSlideSoundStyle, 
  SLIDE_SOUND_STYLES,
  SlideSoundStyle 
} from '../utils/sound';

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
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<SlideSoundStyle>(getSlideSoundStyle());

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
          shape: type === 'heart' ? 'heart' : Math.random() > 0.6 ? 'sparkle' : 'star',
        });
      }

      // If targeting cart, launch a magnetic glowing golden orb to navbar cart
      if (targetCart) {
        const cartBtn = document.getElementById('navbar-cart-btn');
        let targetX = window.innerWidth - 60;
        let targetY = 30;
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
          color: '#D4AF37',
        });
      }
    };

    window.addEventListener('araj:particle-trigger', handleTrigger);
    return () => {
      window.removeEventListener('araj:particle-trigger', handleTrigger);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, fillStyle: string, alpha: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (cx: number, cy: number, size: number, color: string, alpha: number, rot: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 2.2, size * 0.45, 0, 0, Math.PI * 2);
      ctx.ellipse(0, 0, size * 0.45, size * 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawHeart = (cx: number, cy: number, size: number, color: string, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(cx, cy + topCurveHeight);
      ctx.bezierCurveTo(cx, cy, cx - size / 2, cy, cx - size / 2, cy + topCurveHeight);
      ctx.bezierCurveTo(cx - size / 2, cy + (size + topCurveHeight) / 2, cx, cy + (size + topCurveHeight) / 2, cx, cy + size);
      ctx.bezierCurveTo(cx, cy + (size + topCurveHeight) / 2, cx + size / 2, cy + (size + topCurveHeight) / 2, cx + size / 2, cy + topCurveHeight);
      ctx.bezierCurveTo(cx + size / 2, cy, cx, cy, cx, cy + topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Explosion Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // subtle gravity
        p.vx *= 0.96; // drag
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.shape === 'sparkle') {
          drawSparkle(p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        } else if (p.shape === 'heart') {
          drawHeart(p.x, p.y, p.size * 2, p.color, p.alpha);
        } else {
          drawStar(p.x, p.y, 4, p.size, p.size * 0.4, p.color, p.alpha);
        }
      }

      // Render Flying Magnetic Orbs
      const orbs = flyingOrbsRef.current;
      for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        orb.progress += 0.035;

        // Quadratic bezier arc trajectory
        const t = Math.min(orb.progress, 1);
        const cpX = (orb.startX + orb.targetX) / 2 - 80;
        const cpY = Math.min(orb.startY, orb.targetY) - 120;

        orb.currentX = (1 - t) * (1 - t) * orb.startX + 2 * (1 - t) * t * cpX + t * t * orb.targetX;
        orb.currentY = (1 - t) * (1 - t) * orb.startY + 2 * (1 - t) * t * cpY + t * t * orb.targetY;

        // Draw glowing orb
        ctx.save();
        ctx.beginPath();
        ctx.arc(orb.currentX, orb.currentY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#D4AF37';
        ctx.shadowColor = '#F5DE88';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();

        // Trail spark
        if (Math.random() > 0.4) {
          particles.push({
            x: orb.currentX + (Math.random() - 0.5) * 6,
            y: orb.currentY + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: 2,
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
      playSlideSound(1);
    }
  };

  const handleSelectStyle = (style: SlideSoundStyle) => {
    setSlideSoundStyle(style);
    setCurrentStyle(style);
    playSlideSound(1, style);
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
      <aside aria-label="Audio controller" className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 hidden sm:flex flex-col items-end gap-2">
        
        {/* Expanded Sound Customizer Menu */}
        {showSoundMenu && !isMuted && (
          <div className="w-72 rounded-2xl glass-panel-gold border border-[#D4AF37]/40 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-3.5 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D4AF37] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Slide Sound Profiles
              </span>
              <span className="text-[10px] text-[#A6A295] font-mono">PRO AUDIO</span>
            </div>

            {/* Sound Style Presets List */}
            <div className="space-y-1.5">
              {SLIDE_SOUND_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleSelectStyle(style.id)}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    currentStyle === style.id
                      ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#FAF7EE]'
                      : 'hover:bg-white/5 text-[#B8B4A8] hover:text-[#FAF7EE]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{style.icon}</span>
                    <div>
                      <div className="text-xs font-medium leading-none">{style.label}</div>
                      <div className="text-[9px] text-[#88847A] mt-0.5 line-clamp-1">{style.description}</div>
                    </div>
                  </div>
                  {currentStyle === style.id && (
                    <Check className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Audition / Test Buttons */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#A6A295]">Test Slide Glide:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => playSlideSound(-1)}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-semibold text-[#DFDACD] hover:text-[#FAF7EE] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Test Backward Slide Sound"
                >
                  <ChevronLeft className="w-3 h-3" /> Prev
                </button>
                <button
                  onClick={() => playSlideSound(1)}
                  className="px-2 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37]/30 to-[#C59F2D]/30 border border-[#D4AF37]/40 hover:from-[#D4AF37]/50 hover:to-[#C59F2D]/50 text-[10px] font-semibold text-[#F5DE88] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Test Forward Slide Sound"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Capsule Bar */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel-gold border border-[#D4AF37]/35 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/70">
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
              {isMuted ? 'CHIMES MUTED' : 'ROYAL SOUND FX'}
            </span>
          </button>

          {/* Quick Sound Settings Toggle Button */}
          {!isMuted && (
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              title="Configure slide sound effects"
              className={`p-1 rounded-full text-[10px] transition-colors cursor-pointer ${
                showSoundMenu ? 'bg-[#D4AF37] text-black font-bold' : 'hover:bg-white/10 text-[#D4AF37]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Live Audio Equalizer Wave Bar */}
          {!isMuted && (
            <div className="flex items-center gap-0.5 ml-0.5 h-3.5">
              <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${soundActive ? 'h-3.5' : 'h-1.5 animate-pulse'}`} />
              <span className={`w-0.5 bg-[#F5DE88] rounded-full transition-all duration-150 ${soundActive ? 'h-4' : 'h-2 animate-pulse delay-75'}`} />
              <span className={`w-0.5 bg-[#D4AF37] rounded-full transition-all duration-150 ${soundActive ? 'h-3' : 'h-1 animate-pulse delay-150'}`} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
