// Helper for triggering interactive working visual effects across ARAJ flagship

export const triggerParticleBurst = (
  e: React.MouseEvent | { clientX: number; clientY: number },
  options?: {
    type?: 'gold' | 'heart' | 'spice' | 'cart';
    targetCart?: boolean;
  }
) => {
  if (typeof window === 'undefined') return;
  const x = 'clientX' in e ? e.clientX : window.innerWidth / 2;
  const y = 'clientY' in e ? e.clientY : window.innerHeight / 2;

  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent('araj:particle', {
        detail: {
          x,
          y,
          type: options?.type || 'gold',
          targetCart: options?.targetCart ?? false,
        },
      })
    );
  }, 0);
};
