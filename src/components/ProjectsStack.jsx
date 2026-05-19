import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import portfolioData from '../data/portfolioData';

const Card = ({ proj, index, total }) => {
  const cardRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    // Cap stagger to last 6 cards so deep stacks don't shrink into nothing
    const depth = Math.min(total - 1 - index, 6);
    const targetScale = 1 - depth * 0.025;

    const onScroll = () => {
      const wrapper = el.parentElement;
      if (!wrapper) return;
      const r = wrapper.getBoundingClientRect();
      const offset = -r.top;
      const range = r.height;
      const p = Math.max(0, Math.min(1, offset / range));
      const s = 1 - (1 - targetScale) * p;
      setScale(s);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [index, total]);

  return (
    <div
      className="sticky h-fit"
      style={{ top: `${96 + Math.min(index, 6) * 16}px` }}
    >
      <div
        ref={cardRef}
        className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]/40 bg-[#0C0C0C] p-4 sm:p-6 md:p-8 origin-top shadow-[0_-2px_40px_rgba(0,0,0,0.6)]"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {/* Image side */}
          <a
            href={proj.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="md:col-span-3 relative group block overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[44px]"
          >
            <img
              src={proj.image}
              alt={proj.title}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ height: 'clamp(220px, 38vw, 460px)' }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </a>

          {/* Details side */}
          <div className="md:col-span-2 flex flex-col gap-5 sm:gap-6 md:gap-7 md:py-2 md:pl-2">
            <div className="flex items-baseline gap-4">
              <span
                className="hero-heading font-black leading-none shrink-0"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 90px)' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-[#D7E2EA]/50 text-xs sm:text-sm uppercase tracking-[0.25em]">
                {proj.category || 'Project'}
              </span>
            </div>

            <h3
              className="text-[#D7E2EA] font-medium uppercase tracking-tight leading-[1.1]"
              style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.4rem)' }}
            >
              {proj.title}
            </h3>

            {proj.description && (
              <p
                className="text-[#D7E2EA]/70 font-light leading-relaxed"
                style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)' }}
              >
                {proj.description}
              </p>
            )}

            {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {proj.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA]/80 uppercase tracking-wider text-[10px] sm:text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <a
              href={proj.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center gap-2 self-start rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] uppercase tracking-widest text-xs sm:text-sm px-6 py-2.5 hover:bg-[#D7E2EA]/10 transition-colors"
            >
              Live Project <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsStack = () => {
  const projects = portfolioData.projects || [];
  return (
    <section
      id="projects"
      className="relative bg-[#0C0C0C] -mt-10 sm:-mt-12 md:-mt-14 z-10 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-4 sm:px-6 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="hero-heading font-black uppercase tracking-tight text-center mb-16 sm:mb-20 md:mb-28 leading-none"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Projects
      </h2>
      <div className="flex flex-col gap-4 max-w-6xl mx-auto">
        {projects.map((p, i) => (
          <div key={p.id || i} className="h-[65vh] md:h-[70vh]">
            <Card proj={p} index={i} total={projects.length} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsStack;
