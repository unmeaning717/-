import { useEffect, useRef } from 'react';

/* Monochrome aurora: slow-drifting white glows rendered to a tiny offscreen
   canvas and upscaled — free blur, one draw call per frame. */
export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    // Offscreen buffer ~160px wide: gradients drawn here upscale into soft blobs
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');
    if (!offCtx) return;

    let w = 0;
    let h = 0;
    let raf = 0;

    const blobs = [
      { x: 0.18, y: 0.28, r: 0.55, ax: 0.1, ay: 0.07, p1: 34, p2: 27, p3: 19, ph: 0 },
      { x: 0.82, y: 0.2, r: 0.45, ax: 0.08, ay: 0.1, p1: 41, p2: 33, p3: 23, ph: 2.1 },
      { x: 0.55, y: 0.85, r: 0.6, ax: 0.12, ay: 0.06, p1: 37, p2: 45, p3: 29, ph: 4.2 },
    ];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      off.width = 160;
      off.height = Math.max(90, Math.round((160 * h) / Math.max(w, 1)));
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (t: number) => {
      const ow = off.width;
      const oh = off.height;
      offCtx.clearRect(0, 0, ow, oh);
      offCtx.globalCompositeOperation = 'lighter';
      for (const b of blobs) {
        const bx = (b.x + Math.sin(t / b.p1 + b.ph) * b.ax) * ow;
        const by = (b.y + Math.cos(t / b.p2 + b.ph) * b.ay) * oh;
        const r = b.r * Math.min(ow, oh) * (1 + 0.12 * Math.sin(t / b.p3 + b.ph));
        const g = offCtx.createRadialGradient(bx, by, 0, bx, by, r);
        g.addColorStop(0, 'rgba(255,255,255,0.05)');
        g.addColorStop(0.5, 'rgba(255,255,255,0.02)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        offCtx.fillStyle = g;
        offCtx.beginPath();
        offCtx.arc(bx, by, r, 0, Math.PI * 2);
        offCtx.fill();
      }
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(off, 0, 0, w, h);
    };

    if (reduce) {
      draw(0);
    } else {
      const loop = (t: number) => {
        if (!document.hidden) draw(t / 1000);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
