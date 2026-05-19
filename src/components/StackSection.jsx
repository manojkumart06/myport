import { useEffect, useRef, useState } from 'react';
import portfolioData from '../data/portfolioData';

const Pill = ({ label, level, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="group relative inline-flex items-center gap-3 rounded-full border border-[#D7E2EA]/20 px-4 py-2 sm:px-5 sm:py-2.5 text-[#D7E2EA] uppercase tracking-wider text-xs sm:text-sm font-medium hover:border-[#D7E2EA]/50 transition-colors"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s cubic-bezier(0.2,0.7,0.2,1) ${index * 0.04}s, transform 0.5s cubic-bezier(0.2,0.7,0.2,1) ${index * 0.04}s, border-color 0.2s`,
      }}
    >
      <span>{label}</span>
      {typeof level === 'number' && (
        <span className="text-[#D7E2EA]/40 text-[10px] sm:text-xs tracking-widest">
          {level}%
        </span>
      )}
    </span>
  );
};

const Group = ({ title, items, offset = 0 }) => (
  <div className="flex flex-col gap-6 sm:gap-8">
    <h3 className="text-[#D7E2EA]/50 uppercase tracking-[0.3em] text-xs sm:text-sm font-medium">
      {title}
    </h3>
    <div className="flex flex-wrap gap-3 sm:gap-4">
      {items.map((it, i) => (
        <Pill key={it.name} label={it.name} level={it.level} index={offset + i} />
      ))}
    </div>
  </div>
);

const StackSection = () => {
  const skills = portfolioData.skills || [];
  const tools = portfolioData.tools || [];

  return (
    <section
      id="stack"
      className="relative bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="hero-heading font-black uppercase tracking-tight text-center mb-16 sm:mb-20 md:mb-24 leading-none"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Stack
      </h2>
      <div className="max-w-5xl mx-auto flex flex-col gap-14 sm:gap-16 md:gap-20">
        <Group title="Languages" items={skills} offset={0} />
        <Group title="Tools & Frameworks" items={tools} offset={skills.length} />
      </div>
    </section>
  );
};

export default StackSection;
