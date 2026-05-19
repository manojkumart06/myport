import React, { useEffect, useRef } from "react";
import portfolioData from "../data/portfolioData";
import Hero3D from "./Hero3D";

const ContactCTA = () => (
  <a
    href="#contact"
    className="relative inline-block rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-transform duration-300 hover:scale-105 active:scale-95"
    style={{
      background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
      boxShadow: '0 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
      outline: '2px solid white',
      outlineOffset: '-3px',
    }}
  >
    Contact Me
  </a>
);

const Hero = ({ darkMode }) => {
  const portraitRef = useRef(null);

  // Magnet effect: portrait follows the mouse when nearby
  useEffect(() => {
    const el = portraitRef.current;
    if (!el) return;
    const STRENGTH = 3;
    const PADDING = 150;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const max = Math.max(r.width, r.height) / 2 + PADDING;

      if (dist < max) {
        el.style.transition = 'transform 0.3s ease-out';
        el.style.transform = `translate3d(${dx / STRENGTH}px, ${dy / STRENGTH}px, 0)`;
      } else {
        el.style.transition = 'transform 0.6s ease-in-out';
        el.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const firstName = (portfolioData.name || 'Manoj').split(' ')[0];

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-x-clip pt-24">
      {/* Massive heading */}
      <div className="mt-6 sm:mt-4 md:-mt-5 px-4 sm:px-6 pb-4">
        <h1 className="hero-heading font-black uppercase tracking-tighter leading-[1.05] whitespace-nowrap w-full text-center text-[12vw] sm:text-[13vw] md:text-[14vw] lg:text-[15vw]">
          Hi, I&apos;m {firstName}
        </h1>
      </div>

      {/* Bottom bar */}
      <div className="mt-auto flex justify-between items-end gap-4 pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 relative z-20">
        <p
          className="font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
          style={{ color: '#D7E2EA', fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          A frontend developer driven by crafting striking and unforgettable digital experiences
        </p>
        <ContactCTA />
      </div>

      {/* Centered 3D head with magnet effect */}
      <div
        ref={portraitRef}
        className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[460px] md:h-[460px] lg:w-[540px] lg:h-[540px] will-change-transform top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-4 md:bottom-8"
      >
        <div className="relative w-full h-full">
          {/* Soft radial glow behind */}
          <div
            className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-70"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(182,0,168,0.25), rgba(187,76,0,0.15) 40%, transparent 70%)' }}
          />
          <Hero3D />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Hero);
