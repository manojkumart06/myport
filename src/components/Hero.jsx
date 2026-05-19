

import { gsap } from "gsap";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaReact } from "react-icons/fa";
import portfolioData from "../data/portfolioData";

const Hero = ({ darkMode }) => {
    const rootRef = useRef(null);
    const floatingAnimsRef = useRef([]);
    const clockHandRef = useRef(null);
    const [isInView, setIsInView] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== 'undefined' && window.innerWidth < 640);

    // Handle window resize for responsive clock hand
    useEffect(() => {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 640);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Pause/resume floating animations based on visibility
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
          floatingAnimsRef.current.forEach((anim) => {
            if (entry.isIntersecting) {
              anim.play();
            } else {
              anim.pause();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (rootRef.current) {
        observer.observe(rootRef.current);
      }

      return () => observer.disconnect();
    }, []);

    useLayoutEffect(() => {
      // Clear previous animations
      floatingAnimsRef.current = [];

      const ctx = gsap.context(() => {
        // Set initial states
        gsap.set("[data-card]", { scale: 1, opacity: 1 });

        // pop in the badge, headline lines, subtext, buttons, cards & photo
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from("[data-badge]", { y: -12, opacity: 0, duration: 0.4 })
          .from("[data-h1-line]", { y: 40, opacity: 0, stagger: 0.06, duration: 0.6 }, "-=0.1")
          .from("[data-sub]", { y: 16, opacity: 0, duration: 0.5 }, "-=0.2")
          .from("[data-cta]", { y: 16, opacity: 0, stagger: 0.05, duration: 0.45 }, "-=0.25")
          .from("[data-clock]", { scale: 0.8, opacity: 0, duration: 0.8 }, "-=0.3")
          .from("[data-card]", { scale: 0, opacity: 0, stagger: 0.1, duration: 0.5, clearProps: "all" }, "-=0.3")
          .from("[data-photo]", { scale: 0.92, opacity: 0, duration: 0.6 }, "-=0.4");

        // Clock hand animation with pauses at card positions
        // Set initial rotation to 0
        gsap.set(clockHandRef.current, { rotation: 0 });

        const clockTimeline = gsap.timeline({
          repeat: -1,
          onRepeat: () => {
            // Reset rotation to 0 at the start of each loop to prevent accumulation
            gsap.set(clockHandRef.current, { rotation: 0 });
          }
        });

        // Card positions: 12 o'clock (0°), 3 o'clock (90°), 9 o'clock (270°)
        const cardAngles = [
          { angle: 0, card: 'a' },
          { angle: 90, card: 'b' },
          { angle: 270, card: 'c' }
        ];

        cardAngles.forEach(({ angle, card }) => {
          // Rotate to position
          clockTimeline.to(clockHandRef.current, {
            rotation: angle,
            duration: 2,
            ease: "power2.inOut"
          });

          // Trigger highlight animation
          clockTimeline.to(`[data-card-highlight="${card}"]`, {
            scale: 1.1,
            boxShadow: darkMode
              ? "0 0 30px rgba(251, 191, 36, 0.6)"
              : "0 0 30px rgba(245, 158, 11, 0.6)",
            duration: 0.3,
            yoyo: true,
            repeat: 1
          }, "-=0.1");

          // Pause at position
          clockTimeline.to({}, { duration: 1 });
        });

        // Complete the circle: smoothly rotate from 270° to 360° (back to start)
        clockTimeline.to(clockHandRef.current, {
          rotation: 360,
          duration: 2,
          ease: "power2.inOut"
        });

        floatingAnimsRef.current.push(clockTimeline);

      }, rootRef);

      return () => {
        ctx.revert();
        floatingAnimsRef.current = [];
      };
    }, [darkMode]);
  
    return (
      <div
          ref={rootRef}
          className="container mx-auto max-w-7xl min-h-[calc(90svh-64px)] flex items-center justify-center overflow-visible"
        >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center overflow-visible">
  
          {/* LEFT: Headline */}
          <div>
            <div
              data-badge
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold
                         bg-gradient-to-r ring-1
                         ${darkMode
                           ? "from-amber-500/20 to-amber-500/20 ring-amber-500/40 text-amber-300"
                           : "from-amber-500/15 to-amber-500/15 ring-amber-500/30 text-amber-700"}`}
            >
              <span className={`w-2 h-2 rounded-full ${darkMode ? "bg-emerald-400" : "bg-emerald-500"}`} />
              Available for new opportunities
            </div>
  
            <h1 className={`mt-4 leading-[0.9] font-extrabold tracking-tight
                            ${darkMode ? "text-white" : "text-gray-900"}`}>
              <span data-h1-line className="block text-5xl md:text-7xl">Hi, I'm a</span>
              <span data-h1-line className="block text-5xl md:text-7xl">Frontend</span>
              <span data-h1-line className="block text-5xl md:text-7xl">
                <span className="animated-gradient-text">developer</span>
                <span className="align-super text-2xl ml-1">©</span>
                </span>
            </h1>
  
            <p
                data-sub
                className={`mt-5 max-w-xl text-base md:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                I have 4+ years of experience as a dedicated Frontend Developer, sculpting remarkable digital experiences with precision and a deep passion for unraveling complex challenges.
            </p>
          </div>
  
        {/* RIGHT: Clock Design */}
        <div className="relative flex items-center justify-center min-h-[500px] sm:min-h-[700px] w-full py-24 px-4 overflow-visible">
          {/* Clock Face */}
          <div
            data-clock
            className={`relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border-4 overflow-visible
                        ${darkMode
                          ? "bg-zinc-950/40 border-gray-700 shadow-2xl shadow-amber-500/20"
                          : "bg-white/40 backdrop-blur border-gray-300 shadow-2xl shadow-amber-500/20"}`}
          >
            {/* Clock Markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const radius = window.innerWidth >= 640 ? 165 : 120;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={i}
                  className={`absolute w-2 h-2 sm:w-2 sm:h-2 rounded-full
                              ${[0, 3, 9].includes(i)
                                ? darkMode ? "bg-amber-400 shadow-lg shadow-amber-500/50" : "bg-amber-500 shadow-lg shadow-amber-500/50"
                                : darkMode ? "bg-gray-600" : "bg-gray-400"}`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                  }}
                />
              );
            })}

            {/* Clock Hand */}
            <div
              ref={clockHandRef}
              className="absolute left-1/2 top-1/2 origin-bottom"
              style={{
                width: '3px',
                height: isSmallScreen ? '110px' : '150px',
                marginLeft: isSmallScreen ? '-1.5px' : '-2px',
                marginTop: isSmallScreen ? '-110px' : '-150px',
              }}
            >
              <div className={`w-full h-full rounded-full
                              ${darkMode
                                ? "bg-gradient-to-t from-amber-400 to-amber-500"
                                : "bg-gradient-to-t from-amber-500 to-amber-600"}`}
              />
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full
                              ${darkMode ? "bg-amber-400 shadow-lg shadow-amber-500/50" : "bg-amber-500 shadow-lg shadow-amber-500/50"}`}
              />
            </div>

            {/* Center DP Photo */}
            <div
              data-photo
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[140px] h-[140px] sm:w-[200px] sm:h-[200px]
                          rounded-full overflow-hidden shadow-2xl ring-4
                          ${darkMode ? "ring-gray-800" : "ring-white"}`}
            >
              <img
                src={portfolioData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 1: 12 o'clock position (top) */}
          <div
            data-card
            data-card-highlight="a"
            className={`absolute top-2 sm:top-0 left-1/2 -translate-x-1/2
                        w-40 sm:w-48 rounded-xl p-2 sm:p-2.5 shadow-xl border transition-all duration-300 z-10
                        ${darkMode ? "bg-zinc-900/90 border-gray-700" : "bg-white/90 backdrop-blur border-gray-200"}`}
          >
            <p className={`text-xs sm:text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {portfolioData.name}
            </p>
            <p className={`text-[10px] sm:text-[11px] ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {portfolioData.location}
            </p>
            <img
              src="./Media/bg-img-portfolio.jpg"
              alt="Project Preview"
              className="mt-2 h-20 sm:h-24 w-full object-cover rounded-lg"
              loading="lazy"
            />
            <div className="mt-2 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] px-2 py-1 rounded-full
                           bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] text-white"
              >
                <FaReact size={10} className="mr-1" />
                REACT SPECIALIST
              </span>
            </div>
          </div>

          {/* Card 2: 4 o'clock position (right) */}
          <div
            data-card
            data-card-highlight="b"
            className={`absolute -right-3 sm:-right-14 top-1/2 -translate-y-1/4
                        w-27 sm:w-42 rounded-xl px-2 sm:px-3 py-2 sm:py-2.5 shadow-xl border transition-all duration-300 z-10
                        ${darkMode ? "bg-zinc-900/90 border-gray-700" : "bg-white/90 backdrop-blur border-gray-200"}
                        text-[10px] sm:text-xs`}
          >
            <p className={`opacity-90 truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Recent projects ✨
            </p>
            <div className="mt-1.5 flex flex-wrap sm-flex-col  gap-1.5">
              {(portfolioData.brands || []).slice(0, 4).map((b, i) => (
                <a
                  key={i}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-0.5 w-15 text-[9px] sm:text-[10px] rounded-full truncate cursor-pointer
                             bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] text-white
                             transition-all duration-300 ease-out
                             hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
                  title={b.name}
                >
                  {b.name}
                </a>
              ))}
            </div>
          </div>

          {/* Card 3: 8 o'clock position (left) */}
          <div
            data-card
            data-card-highlight="c"
            className={`absolute -left-3 sm:left-3 top-1/2 translate-y-1/4
                        grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-xl shadow-xl border transition-all duration-300 z-10
                        ${darkMode ? "bg-zinc-900/90 border-gray-700" : "bg-white/90 backdrop-blur border-gray-200"}`}
          >
            <a
              href={portfolioData.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className={`p-2 rounded-lg hover:scale-110 transition
                          ${darkMode ? "bg-zinc-800" : "bg-gray-100"}`}
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <FaLinkedin size={18} className="text-[#0077B5]" />
            </a>
            <a
              href={portfolioData.socials.github}
              target="_blank"
              rel="noreferrer"
              className={`p-2 rounded-lg hover:scale-110 transition
                          ${darkMode ? "bg-zinc-800" : "bg-gray-100"}`}
              aria-label="GitHub"
              title="GitHub"
            >
              <FaGithub size={18} className={darkMode ? "text-white" : "text-[#181717]"} />
            </a>
            <a
              href={portfolioData.socials.email}
              className={`p-2 rounded-lg hover:scale-110 transition
                          ${darkMode ? "bg-zinc-800" : "bg-gray-100"}`}
              aria-label="Email"
              title="Email"
            >
              <FaEnvelope size={18} className="text-[#D14836]" />
            </a>
            <a
              href={portfolioData.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className={`p-2 rounded-lg hover:scale-110 transition
                          ${darkMode ? "bg-zinc-800" : "bg-gray-100"}`}
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram size={18} className="text-[#E4405F]" />
            </a>
          </div>
        </div>
        </div>
      </div>
    );
};

export default React.memo(Hero);


