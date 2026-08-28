import { useEffect, useRef } from 'react';

const GLYPHS = ['$', '>', '_', '~'];
const COUNT = 26;

/** Lightweight canvas field of drifting terminal glyphs (3–6% opacity). Pauses off-screen. */
export default function GlyphCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      size: 12 + Math.random() * 16,
      alpha: 0.03 + Math.random() * 0.03,
      vx: (Math.random() - 0.5) * 0.00006,
      vy: -(0.00004 + Math.random() * 0.0001),
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!running) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.05) p.y = 1.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        ctx.font = `${p.size * dpr}px 'Ubuntu Mono', monospace`;
        ctx.fillStyle = `rgba(244, 116, 59, ${p.alpha})`;
        ctx.fillText(p.glyph, p.x * width, p.y * height);
      }
      raf = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
