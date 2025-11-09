import { useEffect, useRef } from 'react';

const FloatingLights = ({ darkMode, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lights = [];
    let connections = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initLights();
    };

    // Light orb class
    class Light {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 25 + 15;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.color = Math.random() > 0.5 ? 'teal' : 'blue';
      }

      update(time) {
        // Floating movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Drift back to base position
        this.x += (this.baseX - this.x) * 0.01;
        this.y += (this.baseY - this.y) * 0.01;

        // Boundary check
        if (this.x < 0 || this.x > canvas.width) {
          this.baseX = Math.random() * canvas.width;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.baseY = Math.random() * canvas.height;
        }

        // Pulse effect
        this.pulsePhase += this.pulseSpeed;
        this.currentOpacity = this.opacity * (0.7 + Math.sin(this.pulsePhase) * 0.3);
      }

      draw() {
        // Get color
        const color = this.color === 'teal'
          ? darkMode ? '15, 158, 176' : '15, 158, 176'
          : darkMode ? '59, 130, 246' : '96, 165, 250';

        // Outer glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(${color}, ${this.currentOpacity})`);
        gradient.addColorStop(0.4, `rgba(${color}, ${this.currentOpacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        const coreGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 0.3);
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${this.currentOpacity * 0.8})`);
        coreGradient.addColorStop(1, `rgba(${color}, ${this.currentOpacity * 0.6})`);

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize lights
    const initLights = () => {
      lights = [];
      const lightCount = Math.max(8, Math.floor((canvas.width * canvas.height) / 80000));
      for (let i = 0; i < lightCount; i++) {
        lights.push(new Light());
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    // Animation loop
    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw lights
      lights.forEach(light => {
        light.update(time);
        light.draw();
      });

      // Draw subtle connecting lines between nearby lights
      for (let i = 0; i < lights.length; i++) {
        for (let j = i + 1; j < lights.length; j++) {
          const dx = lights[i].x - lights[j].x;
          const dy = lights[i].y - lights[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const opacity = (1 - distance / 200) * 0.15;
            ctx.strokeStyle = darkMode
              ? `rgba(15, 158, 176, ${opacity})`
              : `rgba(15, 158, 176, ${opacity * 0.7})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lights[i].x, lights[i].y);
            ctx.lineTo(lights[j].x, lights[j].y);
            ctx.stroke();
          }
        }
      }

      // Add subtle ambient light rays
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      const rayCount = 3;
      for (let i = 0; i < rayCount; i++) {
        const rayAngle = (time * 0.1 + (i * Math.PI * 2) / rayCount) % (Math.PI * 2);
        const rayX = canvas.width / 2 + Math.cos(rayAngle) * canvas.width * 0.3;
        const rayY = canvas.height / 2 + Math.sin(rayAngle) * canvas.height * 0.3;

        const rayGradient = ctx.createRadialGradient(rayX, rayY, 0, rayX, rayY, canvas.width * 0.4);
        rayGradient.addColorStop(0, darkMode ? 'rgba(15, 158, 176, 0.03)' : 'rgba(15, 158, 176, 0.02)');
        rayGradient.addColorStop(1, 'rgba(15, 158, 176, 0)');

        ctx.fillStyle = rayGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.restore();

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

export default FloatingLights;
