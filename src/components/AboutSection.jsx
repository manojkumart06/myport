import { useEffect, useRef, useState } from 'react';
import portfolioData from '../data/portfolioData';

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

// Decorative gradient "3D" orb used in the corners — scroll-parallax + rotation
const Orb = ({ className = '', from, to, size, progress = 0, dx = 0, dy = 0, dr = 0 }) => (
  <div
    className={`pointer-events-none absolute rounded-full will-change-transform ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle at 30% 30%, ${from}, ${to} 70%)`,
      boxShadow: `0 30px 80px ${to}55, inset -10px -20px 40px rgba(0,0,0,0.45), inset 12px 18px 28px rgba(255,255,255,0.08)`,
      filter: 'saturate(110%)',
      transform: `translate3d(${progress * dx}px, ${progress * dy}px, 0) rotate(${progress * dr}deg)`,
      transition: 'transform 0.05s linear',
    }}
  />
);

const AboutSection = () => {
  const sectionRef = useRef(null);
  const paraRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [scrollProg, setScrollProg] = useState(0);

  // Section-relative scroll progress for orb parallax
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // 0 when section's top hits viewport bottom, 1 when section's bottom leaves viewport top
      const total = window.innerHeight + r.height;
      const p = (window.innerHeight - r.top) / total;
      setScrollProg(Math.max(-0.2, Math.min(1.2, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Char-by-char reveal driven by scroll position relative to the paragraph
  useEffect(() => {
    const el = paraRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.25;
      const p = (start - r.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const text = "With over 4+ years of experience in frontend development, I focus on React, performance, and pixel-perfect interfaces. I love working with teams that aim to build memorable, polished products. Let's create something incredible together.";
  const chars = text.split('');

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 overflow-hidden"
    >
      {/* Decorative corner orbs — drift + rotate with scroll */}
      <Orb className="top-[14%] left-[10%] sm:left-[14%]"    from="#BBCCD7" to="#646973" size="clamp(60px, 10vw, 140px)" progress={scrollProg} dx={-120} dy={-60}  dr={120} />
      <Orb className="top-[14%] right-[10%] sm:right-[14%]"  from="#B600A8" to="#18011F" size="clamp(70px, 11vw, 150px)" progress={scrollProg} dx={140}  dy={-80}  dr={-150} />
      <Orb className="bottom-[18%] left-[12%] sm:left-[18%]"   from="#D7E2EA" to="#7721B1" size="clamp(55px, 9vw, 120px)"  progress={scrollProg} dx={-100} dy={120}  dr={-90} />
      <Orb className="bottom-[18%] right-[12%] sm:right-[18%]" from="#BE4C00" to="#18011F" size="clamp(65px, 10vw, 135px)" progress={scrollProg} dx={160}  dy={140}  dr={180} />

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16 max-w-4xl">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          About me
        </h2>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 max-w-4xl w-full">
          {/* Portrait — box with orbiting gradient border */}
          <div className="relative shrink-0">
            <div
              className="absolute -inset-3 -z-10 rounded-3xl blur-2xl opacity-60"
              style={{ background: 'radial-gradient(circle at 50% 50%, rgba(182,0,168,0.35), rgba(187,76,0,0.2) 40%, transparent 70%)' }}
            />
            <div className="orbit-frame rounded-2xl p-[3px]">
              <div className="rounded-[14px] overflow-hidden bg-[#0C0C0C]">
                <img
                  src={portfolioData.avatar}
                  alt={portfolioData.name}
                  className="block object-cover w-[200px] h-[200px] sm:w-[240px] sm:h-[220px] md:w-[280px] md:h-[290px]"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <p
            ref={paraRef}
            className="font-medium leading-relaxed text-center md:text-left flex-1"
            style={{ color: '#D7E2EA', fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          >
            {chars.map((c, i) => {
              const charProgress = progress * chars.length;
              const op = Math.max(0.2, Math.min(1, charProgress - i + 1));
              return (
                <span key={i} style={{ opacity: op, transition: 'opacity 0.2s linear' }}>
                  {c}
                </span>
              );
            })}
          </p>
        </div>

        <div className="mt-4 sm:mt-6 md:mt-8">
          <ContactCTA />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
