import { gsap } from "gsap";
import React, { useLayoutEffect, useRef } from "react";
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaReact } from "react-icons/fa";
import portfolioData from "../data/portfolioData";

const Hero = ({ darkMode }) => {
    const rootRef = useRef(null);
  
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        // pop in the badge, headline lines, subtext, buttons, cards & photo
        gsap.set("[data-float]", { y: 0 });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  
        tl.from("[data-badge]", { y: -12, opacity: 0, duration: 0.4 })
          .from("[data-h1-line]", { y: 40, opacity: 0, stagger: 0.06, duration: 0.6 }, "-=0.1")
          .from("[data-sub]", { y: 16, opacity: 0, duration: 0.5 }, "-=0.2")
          .from("[data-cta]", { y: 16, opacity: 0, stagger: 0.05, duration: 0.45 }, "-=0.25")
          .from("[data-card]", { y: 32, opacity: 0, stagger: 0.08, duration: 0.55 }, "-=0.15")
          .from("[data-photo]", { scale: 0.92, opacity: 0, duration: 0.6 }, "-=0.4");
  
        // subtle floating for cards
        gsap.to("[data-float='a']", { y: -8, repeat: -1, yoyo: true, duration: 2.2, ease: "sine.inOut" });
        gsap.to("[data-float='b']", { y: -10, repeat: -1, yoyo: true, duration: 2.6, ease: "sine.inOut", delay: 0.2 });
        gsap.to("[data-float='c']", { y: -7, repeat: -1, yoyo: true, duration: 2.0, ease: "sine.inOut", delay: 0.1 });
      }, rootRef);
  
      return () => ctx.revert();
    }, []);
  
    return (
      <div ref={rootRef} className="container mx-auto max-w-7x min-h-[calc(90svh-64px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
  
          {/* LEFT: Headline */}
          <div>
            <div
              data-badge
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold
                         bg-gradient-to-r from-blue-500/15 to-purple-500/15
                         ring-1 ring-blue-500/30 text-blue-700 dark:text-blue-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Available for new opportunities
            </div>
  
            <h1 className={`mt-4 leading-[0.9] font-extrabold tracking-tight
                            ${darkMode ? "text-white" : "text-gray-900"}`}>
              <span data-h1-line className="block text-5xl md:text-7xl">Hi, I’m a</span>
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
                I have 3.5+ years of experience as a dedicated Frontend Developer, sculpting remarkable digital experiences with precision and a deep passion for unraveling complex challenges.
            </p>
          </div>
  
        {/* RIGHT: Cards + DP */}
        <div className="relative">
          {/* floating card 1 */}
          <div
            data-card
            data-float="a"
            className={`absolute sm:-top-20 sm:-left-6 -top-6 left-0 w-48 xs:w-56 sm:w-72 rounded-2xl p-3 sm:p-4 shadow-xl border
                        ${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 backdrop-blur border-gray-200"}
                        max-sm:-translate-x-2`}
          >
            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {portfolioData.name}
            </p>
            <p className={`text-[11px] ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {portfolioData.location}
            </p>
            <img
              src="/Media/bg-img-portfolio.jpg"
              alt="Project Preview"
              className="mt-3 h-20 sm:h-36 w-full object-cover rounded-lg"
            />
            <div className="mt-3 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] px-2 py-1 rounded-full
                           bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                <FaReact size={11} className="mr-1" />
                REACT SPECIALIST
              </span>
            </div>
          </div>

          {/* DP photo */}
          <div
            data-photo
            className={`relative ml-auto mr-8 lg:mr-6 mb-8
                        w-[150px] h-[170px] xs:w-[170px] xs:h-[190px] sm:w-[280px] sm:h-[260px]
                        rounded-2xl overflow-hidden shadow-2xl
                        ${darkMode ? "ring-1 ring-gray-700" : "ring-1 ring-gray-200"}`}
          >
            <img
              src={portfolioData.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* floating brand pill */}
          <div
            data-card
            data-float="b"
            className="absolute -bottom-20 sm:-bottom-16 left-0 right-0 mx-auto
                       w-[92%] xs:w-[88%] sm:w-[75%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-xl
                       bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[11px] sm:text-sm"
          >
            <p className="opacity-90 truncate">The most recent projects I happily worked with ✨</p>
            <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1.5 sm:gap-2 items-center">
              {(portfolioData.brands || []).map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full bg-white/15 max-w-[45%] sm:max-w-none truncate"
                  title={b.name}
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>

          {/* small float icon group */}
          <div
            data-card
            data-float="c"
            className={`absolute -right-6 sm:-right-15 -top-6 sm:-top-30 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 p-2 rounded-2xl shadow-xl
                ${darkMode ? "bg-gray-800/80 border border-gray-700" : "bg-white/80 backdrop-blur border border-gray-200"}`}            
            >
            <a
              href={portfolioData.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <FaLinkedin size={16} className="text-[#0077B5]" />
            </a>
            <a
              href={portfolioData.socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
              aria-label="GitHub"
              title="GitHub"
            >
              <FaGithub size={16} className="text-[#181717]" />
            </a>
            <a
              href={portfolioData.socials.email}
              className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
              aria-label="Email"
              title="Email"
            >
              <FaEnvelope size={16} className="text-[#D14836]" />
            </a>
            <a
              href={portfolioData.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 sm:p-2 rounded-full bg-white hover:scale-105 transition"
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram size={16} className="text-[#E4405F]" />
            </a>
          </div>
        </div>
        </div>
      </div>
    );
};
  

export default Hero;