import { useEffect, useRef } from 'react';

const CinematicBackground = ({ darkMode, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let inView = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      mouse.tx = x;
      mouse.ty = y;
      if (!mouse.active) { mouse.x = x; mouse.y = y; mouse.active = true; }
    };
    const onLeave = () => { mouse.active = false; mouse.tx = -9999; mouse.ty = -9999; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    const GRID = 32;
    const DOT_R = 1;
    const SPOT_R = 220;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;

      ctx.fillStyle = darkMode ? '#09090b' : '#fafafa';
      ctx.fillRect(0, 0, w, h);

      const baseDot = darkMode ? 'rgba(245, 158, 11, 0.18)' : 'rgba(217, 119, 6, 0.22)';
      const hotDot = darkMode ? 'rgba(251, 191, 36, 0.95)' : 'rgba(217, 119, 6, 0.85)';

      for (let x = GRID / 2; x < w; x += GRID) {
        for (let y = GRID / 2; y < h; y += GRID) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = Math.max(0, 1 - dist / SPOT_R);
          const radius = DOT_R + t * 2.2;

          if (t > 0.02) {
            ctx.fillStyle = `rgba(${darkMode ? '251, 191, 36' : '217, 119, 6'}, ${0.18 + t * 0.77})`;
          } else {
            ctx.fillStyle = baseDot;
          }
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (mouse.active) {
        ctx.globalCompositeOperation = darkMode ? 'lighter' : 'multiply';
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, SPOT_R * 1.3);
        glow.addColorStop(0, darkMode ? 'rgba(245, 158, 11, 0.22)' : 'rgba(217, 119, 6, 0.10)');
        glow.addColorStop(0.5, darkMode ? 'rgba(245, 158, 11, 0.08)' : 'rgba(217, 119, 6, 0.04)');
        glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
      }

      const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.max(w, h) * 0.75);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.15)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    };

    const loop = () => {
      if (inView) draw();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      io.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default CinematicBackground;
