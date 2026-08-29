import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/* Two-layer cursor: a near-instant dot plus a lagging halo ring.
   Pointer position lives in motion values — mousemove never re-renders. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const dotX = useSpring(x, { stiffness: 900, damping: 65, mass: 0.15 });
  const dotY = useSpring(y, { stiffness: 900, damping: 65, mass: 0.15 });
  const ringX = useSpring(x, { stiffness: 200, damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 200, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    document.documentElement.classList.add('custom-cursor');

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest('a, button, [data-cursor="hover"]'));
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      document.documentElement.classList.remove('custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY }}
      >
        <motion.div
          className="w-2 h-2 -ml-1 -mt-1 rounded-full bg-white mix-blend-difference"
          animate={{ scale: hovering ? 0.4 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="w-8 h-8 -ml-4 -mt-4 rounded-full border border-white mix-blend-difference"
          animate={{
            scale: hovering ? 1.7 : 1,
            opacity: hovering ? 0.9 : 0.35,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        />
      </motion.div>
    </>
  );
}
