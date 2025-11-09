import { useEffect, useRef } from 'react';

const AnimatedGradient = ({ darkMode, colors = null, className = '' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Default color schemes
    const defaultColors = darkMode
      ? [
          { r: 15, g: 158, b: 176, a: 0.15 },  // Teal
          { r: 59, g: 130, b: 246, a: 0.15 },  // Blue
          { r: 139, g: 92, b: 246, a: 0.15 },  // Purple
        ]
      : [
          { r: 15, g: 158, b: 176, a: 0.08 },  // Teal (lighter)
          { r: 96, g: 165, b: 250, a: 0.08 },  // Light blue
          { r: 167, g: 139, b: 250, a: 0.08 }, // Light purple
        ];

    const colorScheme = colors || defaultColors;

    // Animation loop
    const animate = () => {
      timeRef.current += 0.005;

      // Create gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Animate gradient stops
      const offset1 = (Math.sin(timeRef.current) + 1) / 2;
      const offset2 = (Math.cos(timeRef.current * 0.8) + 1) / 2;
      const offset3 = (Math.sin(timeRef.current * 1.2) + 1) / 2;

      gradient.addColorStop(
        0,
        `rgba(${colorScheme[0].r}, ${colorScheme[0].g}, ${colorScheme[0].b}, ${colorScheme[0].a * offset1})`
      );
      gradient.addColorStop(
        0.5,
        `rgba(${colorScheme[1].r}, ${colorScheme[1].g}, ${colorScheme[1].b}, ${colorScheme[1].a * offset2})`
      );
      gradient.addColorStop(
        1,
        `rgba(${colorScheme[2].r}, ${colorScheme[2].g}, ${colorScheme[2].b}, ${colorScheme[2].a * offset3})`
      );

      // Clear and draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ mixBlendMode: darkMode ? 'screen' : 'multiply' }}
    />
  );
};

export default AnimatedGradient;
