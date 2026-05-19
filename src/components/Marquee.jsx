import { useEffect, useRef, useState } from 'react';
import portfolioData from '../data/portfolioData';

const Marquee = () => {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      // Move only when section is approaching / inside the viewport
      const raw = (window.scrollY - top + window.innerHeight) * 0.3;
      setOffset(raw);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const projects = portfolioData.projects || [];
  // Split projects into 2 rows, then triple each row for seamless feel
  const mid = Math.ceil(projects.length / 2);
  const row1 = [...projects.slice(0, mid), ...projects.slice(0, mid), ...projects.slice(0, mid)];
  const row2 = [...projects.slice(mid), ...projects.slice(mid), ...projects.slice(mid)];

  const Tile = ({ p }) => (
    <a
      href={p.liveUrl}
      target="_blank"
      rel="noreferrer"
      className="group relative shrink-0 rounded-2xl overflow-hidden border border-[#D7E2EA]/10"
      style={{ width: 380, height: 240 }}
    >
      <img
        src={p.image}
        alt={p.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-[#D7E2EA]">
        <span className="text-sm md:text-base font-medium uppercase tracking-wider truncate">{p.title}</span>
      </div>
    </a>
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-12"
    >
      <div className="flex flex-col gap-3 will-change-transform">
        <div
          className="flex gap-3 will-change-transform"
          style={{ transform: `translateX(${offset - 200}px)` }}
        >
          {row1.map((p, i) => <Tile key={`r1-${i}`} p={p} />)}
        </div>
        <div
          className="flex gap-3 will-change-transform"
          style={{ transform: `translateX(${-(offset - 200)}px)` }}
        >
          {row2.map((p, i) => <Tile key={`r2-${i}`} p={p} />)}
        </div>
      </div>
    </section>
  );
};

export default Marquee;
