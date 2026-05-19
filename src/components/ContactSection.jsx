import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import portfolioData from '../data/portfolioData';

const ContactCTA = () => (
  <a
    href={`mailto:${portfolioData.email}`}
    className="relative inline-flex items-center gap-2 rounded-full text-white font-medium uppercase tracking-widest px-10 py-4 sm:px-12 sm:py-5 text-sm sm:text-base transition-transform duration-300 hover:scale-105 active:scale-95"
    style={{
      background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
      boxShadow: '0 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
      outline: '2px solid white',
      outlineOffset: '-3px',
    }}
  >
    Let&apos;s Talk <ArrowUpRight size={18} />
  </a>
);

const ContactSection = () => {
  const socials = portfolioData.socials || {};
  return (
    <section
      id="contact"
      className="relative bg-[#0C0C0C] min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 overflow-hidden"
    >
      <h2
        className="hero-heading font-black uppercase tracking-tight text-center leading-none mb-10 sm:mb-14 md:mb-16"
        style={{ fontSize: 'clamp(3rem, 14vw, 200px)' }}
      >
        Let&apos;s Talk
      </h2>

      <p
        className="text-center font-light leading-relaxed max-w-2xl mb-12 sm:mb-16"
        style={{ color: '#D7E2EA', fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)' }}
      >
        Open to freelance work, full-time roles, and interesting collaborations.
        Drop a message and let&apos;s build something memorable.
      </p>

      <div className="flex flex-col items-center gap-6 mb-12 sm:mb-16">
        <a
          href={`mailto:${portfolioData.email}`}
          className="flex items-center gap-3 text-[#D7E2EA] hover:text-white transition-colors group"
          style={{ fontSize: 'clamp(1.1rem, 2.4vw, 1.75rem)' }}
        >
          <Mail size={20} strokeWidth={1.5} className="opacity-70" />
          <span className="font-medium underline-offset-4 group-hover:underline">{portfolioData.email}</span>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[#D7E2EA]/70 uppercase tracking-widest text-xs sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <Phone size={14} strokeWidth={1.5} /> {portfolioData.phone}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={14} strokeWidth={1.5} /> {portfolioData.location}
          </span>
        </div>
      </div>

      <ContactCTA />

      {(socials.linkedin || socials.github || socials.instagram || socials.stackoverflow || socials.quora) && (
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm">
          {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#D7E2EA] transition-colors">LinkedIn</a>}
          {socials.github && <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-[#D7E2EA] transition-colors">GitHub</a>}
          {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-[#D7E2EA] transition-colors">Instagram</a>}
          {socials.stackoverflow && <a href={socials.stackoverflow} target="_blank" rel="noreferrer" className="hover:text-[#D7E2EA] transition-colors">StackOverflow</a>}
          {socials.quora && <a href={socials.quora} target="_blank" rel="noreferrer" className="hover:text-[#D7E2EA] transition-colors">Quora</a>}
        </div>
      )}
    </section>
  );
};

export default ContactSection;
