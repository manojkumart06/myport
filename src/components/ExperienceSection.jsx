import { useEffect, useRef, useState } from 'react';
import portfolioData from '../data/portfolioData';

const Row = ({ exp, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-start gap-6 sm:gap-10 md:gap-14 py-8 sm:py-10 md:py-12 border-t border-[#D7E2EA]/15"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s cubic-bezier(0.2,0.7,0.2,1) ${index * 0.1}s, transform 0.7s cubic-bezier(0.2,0.7,0.2,1) ${index * 0.1}s`,
      }}
    >
      <span
        className="hero-heading font-black shrink-0 leading-none"
        style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 pt-2 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3
            className="text-[#D7E2EA] font-medium uppercase tracking-wide"
            style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
          >
            {exp.role}
          </h3>
          <span className="text-[#BBCCD7]/70 uppercase tracking-widest text-xs sm:text-sm">
            {exp.period}
          </span>
        </div>
        <p className="text-[#D7E2EA]/60 uppercase tracking-wider text-xs sm:text-sm">
          {exp.company}
        </p>
        <p
          className="text-[#D7E2EA] font-light leading-relaxed max-w-2xl"
          style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.2rem)', opacity: 0.7 }}
        >
          {exp.description}
        </p>
      </div>
    </div>
  );
};

const ExperienceSection = () => {
  const experience = portfolioData.experience || [];
  return (
    <section
      id="experience"
      className="relative bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="hero-heading font-black uppercase tracking-tight text-center mb-16 sm:mb-20 md:mb-28 leading-none"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Experience
      </h2>
      <div className="max-w-5xl mx-auto">
        {experience.map((exp, i) => <Row key={i} exp={exp} index={i} />)}
        <div className="border-t border-[#D7E2EA]/15" />
      </div>
    </section>
  );
};

export default ExperienceSection;
