import { useEffect, useRef } from 'react';

const WaveBackground = ({ darkMode, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const waves = [
        { amplitude: 40, frequency: 0.015, speed: 0.5, opacity: darkMode ? 0.15 : 0.12, offset: 0.2 },
        { amplitude: 50, frequency: 0.012, speed: 0.7, opacity: darkMode ? 0.12 : 0.10, offset: 0.4 },
        { amplitude: 60, frequency: 0.01, speed: 1, opacity: darkMode ? 0.10 : 0.08, offset: 0.6 },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * wave.offset);

        for (let x = 0; x < canvas.width; x++) {
          const y =
            canvas.height * wave.offset +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        const baseColor = darkMode ? '245, 158, 11' : '245, 158, 11';
        const accentColor = darkMode ? '251, 191, 36' : '217, 119, 6';

        gradient.addColorStop(0, `rgba(${baseColor}, ${wave.opacity})`);
        gradient.addColorStop(0.5, `rgba(${accentColor}, ${wave.opacity * 0.7})`);
        gradient.addColorStop(1, `rgba(${baseColor}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Add stroke for wave line
        ctx.strokeStyle = `rgba(${baseColor}, ${wave.opacity * 1.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * wave.offset + Math.sin(time * wave.speed) * wave.amplitude);
        for (let x = 0; x < canvas.width; x++) {
          const y =
            canvas.height * wave.offset +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
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

export default WaveBackground;
