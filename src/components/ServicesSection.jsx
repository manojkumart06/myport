import { useEffect, useRef, useState } from 'react';

const SERVICES = [
  {
    n: '01',
    name: 'Frontend Development',
    desc: 'Production-ready React and TypeScript apps with a focus on architecture, performance, and maintainability across teams.',
  },
  {
    n: '02',
    name: 'UI Engineering',
    desc: 'Pixel-perfect interfaces built from design files — accessible, responsive, and motion-aware down to the last interaction.',
  },
  {
    n: '03',
    name: 'Performance',
    desc: 'Audits and rebuilds that bring real-world Core Web Vitals under target — bundle, render, image, and network paths.',
  },
  {
    n: '04',
    name: 'Design Systems',
    desc: 'Component libraries, token systems, and documentation that keep product teams shipping consistently at speed.',
  },
  {
    n: '05',
    name: 'Web Animation',
    desc: 'Scroll-driven, cinematic motion using GSAP and modern CSS — narrative interactions that elevate the brand.',
  },
];

const Row = ({ s, index }) => {
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
      className="flex items-start gap-6 sm:gap-10 md:gap-14 py-8 sm:py-10 md:py-12 border-t"
      style={{
        borderColor: 'rgba(12, 12, 12, 0.15)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s cubic-bezier(0.2,0.7,0.2,1) ${index * 0.1}s, transform 0.7s cubic-bezier(0.2,0.7,0.2,1) ${index * 0.1}s`,
      }}
    >
      <span
        className="font-black text-[#0C0C0C] shrink-0 leading-none"
        style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
      >
        {s.n}
      </span>
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 pt-2">
        <h3
          className="text-[#0C0C0C] font-medium uppercase tracking-wide"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
        >
          {s.name}
        </h3>
        <p
          className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl"
          style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
        >
          {s.desc}
        </p>
      </div>
    </div>
  );
};

const ServicesSection = () => (
  <section
    id="services"
    className="relative bg-white px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]"
  >
    <h2
      className="text-[#0C0C0C] font-black uppercase tracking-tight text-center mb-16 sm:mb-20 md:mb-28 leading-none"
      style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
    >
      Services
    </h2>
    <div className="max-w-5xl mx-auto">
      {SERVICES.map((s, i) => <Row key={s.n} s={s} index={i} />)}
      <div className="border-t" style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }} />
    </div>
  </section>
);

export default ServicesSection;
