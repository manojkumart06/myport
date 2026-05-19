import { useEffect, useRef } from 'react';

const OrbitalBackground = ({ darkMode, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let orbs = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initOrbs();
    };

    // Orb class
    class Orb {
      constructor(index, total) {
        this.index = index;
        this.total = total;
        this.angle = (Math.PI * 2 * index) / total;
        this.radius = Math.random() * 100 + 50;
        this.speed = (Math.random() * 0.5 + 0.3) * (Math.random() > 0.5 ? 1 : -1);
        this.centerX = 0;
        this.centerY = 0;
        this.size = Math.random() * 20 + 10;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.hue = Math.random() * 30 + 200;
      }

      update() {
        this.angle += this.speed * 0.01;
        this.centerX = canvas.width / 2 + Math.sin(Date.now() * 0.0001 + this.index) * 100;
        this.centerY = canvas.height / 2 + Math.cos(Date.now() * 0.0001 + this.index) * 50;
      }

      draw() {
        const x = this.centerX + Math.cos(this.angle) * this.radius;
        const y = this.centerY + Math.sin(this.angle) * this.radius;

        // Gradient for the orb
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.size);
        gradient.addColorStop(0, darkMode
          ? `rgba(215, 226, 234, ${this.opacity})`
          : `rgba(215, 226, 234, ${this.opacity * 0.7})`
        );
        gradient.addColorStop(0.5, darkMode
          ? `rgba(187, 204, 215, ${this.opacity * 0.5})`
          : `rgba(100, 105, 115, ${this.opacity * 0.4})`
        );
        gradient.addColorStop(1, 'rgba(215, 226, 234, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Trail effect
        ctx.strokeStyle = darkMode
          ? `rgba(215, 226, 234, ${this.opacity * 0.2})`
          : `rgba(215, 226, 234, ${this.opacity * 0.1})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Initialize orbs
    const initOrbs = () => {
      orbs = [];
      const orbCount = 5;
      for (let i = 0; i < orbCount; i++) {
        orbs.push(new Orb(i, orbCount));
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach(orb => {
        orb.update();
        orb.draw();
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

export default OrbitalBackground;
