import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

interface CinematicBrandIntroProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export const CinematicBrandIntro: React.FC<CinematicBrandIntroProps> = ({ 
  onComplete,
  forcePlay = false 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timelineStep, setTimelineStep] = useState<
    'darkness' | 'sweep' | 'settle' | 'typography' | 'hold' | 'exit'
  >('darkness');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check session storage on initial mount
  const isFirstVisitRef = useRef<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!forcePlay) {
      const alreadySeen = sessionStorage.getItem('araj_pure_intro_seen');
      if (alreadySeen === 'true') {
        isFirstVisitRef.current = false;
        // Fast-path: Quick 1.2s micro reveal on repeat visit
      }
    }

    // Lock body scroll during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const isQuickMode = !isFirstVisitRef.current && !forcePlay;

    // Timers according to the required 4-5s timeline:
    // 0.0 - 1.0s: darkness + particles + forming warm golden center glow
    // 1.0 - 2.2s: light sweep + logo smooth reveal with golden glow
    // 2.2 - 3.5s: logo settles, subtle golden aura & specular reflection
    // 3.5 - 4.5s: typography underneath reveals (PURE BY TRADITION / CRAFTED WITH TRUST)
    // 4.5 - 4.8s: hold complete composition
    // 4.8 - 5.3s: exit transition smoothly into website

    const tSweep = setTimeout(() => {
      setTimelineStep('sweep');
    }, isQuickMode ? 200 : 1000);

    const tSettle = setTimeout(() => {
      setTimelineStep('settle');
    }, isQuickMode ? 500 : 2200);

    const tType = setTimeout(() => {
      setTimelineStep('typography');
    }, isQuickMode ? 800 : 3500);

    const tHold = setTimeout(() => {
      setTimelineStep('hold');
    }, isQuickMode ? 1100 : 4500);

    const tExit = setTimeout(() => {
      handleComplete();
    }, isQuickMode ? 1400 : 4850);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(tSweep);
      clearTimeout(tSettle);
      clearTimeout(tType);
      clearTimeout(tHold);
      clearTimeout(tExit);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [forcePlay]);

  const handleComplete = () => {
    setTimelineStep('exit');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('araj_pure_intro_seen', 'true');
    }
    // Allow exit fade to complete (500ms)
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 550);
  };

  // High-performance HTML5 Canvas Golden Dust Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 45 delicate golden particles with inward drifting physics
    const particleCount = window.innerWidth < 768 ? 28 : 45;
    const centerX = width / 2;
    const centerY = height / 2;

    const particles = Array.from({ length: particleCount }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * (Math.max(width, height) / 1.6);
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        targetX: centerX + (Math.random() - 0.5) * 160,
        targetY: centerY + (Math.random() - 0.5) * 160,
        size: 0.8 + Math.random() * 1.8,
        speed: 0.0015 + Math.random() * 0.003,
        alpha: 0,
        maxAlpha: 0.25 + Math.random() * 0.55,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseAngle: Math.random() * Math.PI * 2,
        color: Math.random() > 0.3 ? '#F5DE88' : '#D4AF37',
      };
    });

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, width, height);

      const currentCenterX = width / 2;
      const currentCenterY = height / 2;

      // Particle entry fade during 0.0 - 1.2s
      const globalFade = Math.min(1, elapsed / 1000);

      particles.forEach((p) => {
        // Slow inward drift towards the warm center aura
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;

        // If particle gets too close to center, re-disperse softly outward
        const dist = Math.hypot(p.x - currentCenterX, p.y - currentCenterY);
        if (dist < 40) {
          const newAngle = Math.random() * Math.PI * 2;
          const newRadius = 250 + Math.random() * (Math.max(width, height) / 2);
          p.x = currentCenterX + Math.cos(newAngle) * newRadius;
          p.y = currentCenterY + Math.sin(newAngle) * newRadius;
        }

        // Breathing alpha pulse
        p.pulseAngle += p.pulseSpeed;
        const pulse = 0.5 + 0.5 * Math.sin(p.pulseAngle);
        const currentAlpha = p.maxAlpha * pulse * globalFade;

        // Render soft glowing dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = '#F5DE88';
        ctx.shadowBlur = p.size * 3;
        ctx.fill();
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {timelineStep !== 'exit' ? (
        <motion.div
          key="cinematic-brand-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden select-none bg-[#020704]"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, #061F12 0%, #031008 45%, #010503 100%)',
          }}
        >
          {/* Subtle Deep Luxury Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-[#010603]/40 to-[#000201] opacity-90" />

          {/* Golden Floating Dust Particles Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none w-full h-full z-10"
          />

          {/* 0.0–1.0s: Soft Warm Golden Volumetric Glow behind Logo position */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: timelineStep === 'darkness' ? [0, 0.45, 0.7] : 0.85,
              scale: timelineStep === 'darkness' ? [0.7, 0.95, 1.05] : [1.05, 1.1, 1.05],
            }}
            transition={{
              duration: 3,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute w-64 h-64 sm:w-[450px] sm:h-[450px] rounded-full pointer-events-none z-10"
            style={{
              background:
                'radial-gradient(circle, rgba(212, 175, 55, 0.28) 0%, rgba(245, 222, 136, 0.12) 38%, rgba(6, 31, 18, 0.04) 68%, transparent 80%)',
              filter: 'blur(35px)',
            }}
          />

          {/* 1.0–2.2s: Thin Cinematic Champagne-Gold Light Sweep */}
          <AnimatePresence>
            {(timelineStep === 'sweep' || timelineStep === 'settle') && (
              <motion.div
                key="light-sweep-beam"
                initial={{ x: '-120%', opacity: 0 }}
                animate={{ x: '180%', opacity: [0, 0.9, 1, 0.8, 0] }}
                transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 w-48 sm:w-72 pointer-events-none z-30 transform -skew-x-[25deg]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(245, 222, 136, 0.08) 25%, rgba(255, 250, 225, 0.75) 50%, rgba(212, 175, 55, 0.3) 75%, transparent 100%)',
                  filter: 'blur(12px)',
                }}
              >
                {/* Intense central needle line */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-[#FFFDF5] to-transparent shadow-[0_0_20px_#F5DE88]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Logo & Typography Crest Container */}
          <div className="relative z-20 flex flex-col items-center justify-center px-4 max-w-xl text-center">
            
            {/* The ARAJ Official Logo (100% Unaltered, Sharp, Crisp, Exact) */}
            <div className="relative flex items-center justify-center">
              
              {/* Subtle Golden Radial Aura behind the badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: timelineStep !== 'darkness' ? 1 : 0,
                  scale: timelineStep !== 'darkness' ? [1, 1.04, 1] : 0.8,
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
                className="absolute -inset-4 sm:-inset-6 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, rgba(245, 222, 136, 0.12) 45%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />

              {/* ARAJ Logo Reveal Motion */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
                animate={{
                  opacity: timelineStep === 'darkness' ? 0 : 1,
                  scale: timelineStep === 'darkness' ? 0.94 : 1,
                  filter: timelineStep === 'darkness' ? 'blur(8px)' : 'blur(0px)',
                }}
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative overflow-hidden p-2 rounded-full"
              >
                {/* Exact ARAJ Logo Asset */}
                <img
                  src="/images/logo.png"
                  alt="ARAJ Dry Fruits & Spices"
                  className="w-36 h-36 xs:w-44 xs:h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain select-none pointer-events-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] drop-shadow-[0_0_25px_rgba(212,175,55,0.22)]"
                  style={{ imageRendering: 'auto' }}
                />

                {/* 2.2–3.5s: Subtle Specular Sheen across Logo surface */}
                <AnimatePresence>
                  {(timelineStep === 'settle' || timelineStep === 'typography' || timelineStep === 'hold') && (
                    <motion.div
                      key="logo-specular-shimmer"
                      initial={{ x: '-150%', opacity: 0 }}
                      animate={{ x: '180%', opacity: [0, 0.45, 0.6, 0.4, 0] }}
                      transition={{ duration: 1.2, delay: 0.25, ease: 'easeInOut' }}
                      className="absolute inset-0 pointer-events-none transform -skew-x-12"
                      style={{
                        background:
                          'linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.32) 50%, transparent 65%)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* 3.5–4.5s: Premium Typography Reveal */}
            <div className="mt-8 sm:mt-10 flex flex-col items-center space-y-3 sm:space-y-4 min-h-[90px]">
              
              {/* Line 1: “PURE BY TRADITION” */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity:
                    timelineStep === 'typography' || timelineStep === 'hold'
                      ? 1
                      : 0,
                  y:
                    timelineStep === 'typography' || timelineStep === 'hold'
                      ? 0
                      : 14,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <h1 className="font-serif tracking-[0.32em] sm:tracking-[0.45em] text-base sm:text-lg md:text-xl font-medium text-[#FAF7EE] uppercase whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  PURE BY TRADITION
                </h1>
              </motion.div>

              {/* Delicate Champagne-Gold Filament Divider with Star Accent */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{
                  opacity:
                    timelineStep === 'typography' || timelineStep === 'hold'
                      ? 0.75
                      : 0,
                  scaleX:
                    timelineStep === 'typography' || timelineStep === 'hold'
                      ? 1
                      : 0,
                }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center gap-3 w-48 sm:w-64"
              >
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-[#F5DE88]" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#F5DE88] shadow-[0_0_8px_#F5DE88]" />
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/70 to-[#F5DE88]" />
              </motion.div>

              {/* Line 2: “CRAFTED WITH TRUST” */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity:
                    timelineStep === 'typography' || timelineStep === 'hold'
                      ? 0.95
                      : 0,
                  y:
                    timelineStep === 'typography' || timelineStep === 'hold'
                      ? 0
                      : 10,
                }}
                transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-sans font-light tracking-[0.38em] sm:tracking-[0.52em] text-[11px] sm:text-xs md:text-sm text-[#E6C875] uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  CRAFTED WITH TRUST
                </p>
              </motion.div>
            </div>

            {/* 4.5–5.0s: Final Golden Crest Shimmer Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: timelineStep === 'hold' ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest text-[#D4AF37]/80 uppercase"
            >
              <Sparkles className="w-3 h-3 text-[#F5DE88] animate-pulse" />
              <span>Agra Heritage Since 1985</span>
              <Sparkles className="w-3 h-3 text-[#F5DE88] animate-pulse" />
            </motion.div>
          </div>

          {/* Minimalist Champagne "Skip Intro" Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            whileHover={{ opacity: 1, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleComplete}
            aria-label="Skip website intro animation"
            className="absolute top-6 right-6 z-30 px-3.5 py-1.5 rounded-full glass-panel border border-[#D4AF37]/35 text-[11px] font-mono tracking-widest text-[#FAF7EE] hover:text-[#F5DE88] hover:border-[#F5DE88] transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-lg"
          >
            <span>Skip Intro</span>
            <span className="text-[9px] text-[#A6A295] hidden sm:inline">[ESC]</span>
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
