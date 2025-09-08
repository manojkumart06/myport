import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Menu, X, Github, Linkedin, Mail, ExternalLink, 
  MessageCircle, Send, User, Bot, ChevronLeft, ChevronRight,
  MapPin, Plane, Car
} from 'lucide-react';
import portfolioData from './data/portfolioData.json';
import ProgressBar from './components/ProgressBar';
import Hero from './components/Hero';

/** Hook to compute traveler top position along a section's height */
const useTraveler = () => {
  const containerRef = useRef(null);
  const [topPx, setTopPx] = useState(0);

  useEffect(() => {
    let rafId = null;
    const ICON_SIZE = 24; // plane size (w-6 h-6)
    const DOT_SIZE = 16;  // dot size (w-4 h-4)
    const ICON_RADIUS = ICON_SIZE / 2;

    const calc = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Progress driven by viewport center crossing the container
      // 0 when viewport center at container top, 1 at container bottom
      const progress = Math.min(Math.max((vh / 2 - rect.top) / rect.height, 0), 1);

      // Find first & last items to define the line segment
      const items = el.querySelectorAll('[data-timeline-item]');
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      const firstDotCenter = first.offsetTop + DOT_SIZE / 2;
      const lastDotCenter = last.offsetTop + DOT_SIZE / 2;

      const trackLength = Math.max(lastDotCenter - firstDotCenter, 0);

      // Plane center along the track, then convert to "top" for absolute element
      const planeCenter = firstDotCenter + progress * trackLength;
      const planeTop = Math.max(planeCenter - ICON_RADIUS, 0);

      setTopPx(planeTop);
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        calc();
      });
    };

    // Initial + listeners
    calc();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    // Recalculate if the container size/content changes
    const ro = new ResizeObserver(() => onScrollOrResize());
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return { containerRef, topPx };
};



const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m an AI assistant trained on this portfolio. Ask me anything about the owner\'s skills, experience, or projects!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef(null);

// Projects row: translateX-based marquee (persist offset across renders)
const projectsContainerRef = useRef(null); // viewport
const projectsStripRef = useRef(null);     // moving strip

const [projectsInView, setProjectsInView] = useState(false);
const [projectsHover, setProjectsHover] = useState(false); // UI only

// Refs that drive animation logic (don't trigger re-renders)
const hoverRef = useRef(false);
const offsetRef = useRef(0);
const halfWidthRef = useRef(0);



  // traveler hooks for Experience and Education sections
  const expTraveler = useTraveler();
  const eduTraveler = useTraveler();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // AI Training Data (auto-built from real data)
  const trainingData = {
    personalInfo: {
      name: portfolioData.name,
      title: portfolioData.title,
      location: portfolioData.location,
      bio: portfolioData.bio
    },
    skills: [
      ...portfolioData.skills.map(s => `${s.name} (${s.level}%)`),
      ...portfolioData.tools.map(t => `${t.name} (${t.level}%)`)
    ].join(', '),
    projects: portfolioData.projects.map(p => `${p.title}: ${p.description}`).join('. '),
    experience: portfolioData.experience.map(e => `${e.role} at ${e.company} (${e.period}): ${e.description}`).join(' '),
    education: portfolioData.education.map(ed => `${ed.degree} at ${ed.school} (${ed.period})`).join('; '),
    interests: "Frontend, React, Redux, UI/UX, Web Performance",
    contact: `Email: ${portfolioData.email}, Phone: ${portfolioData.phone}`
  };

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tools')) {
      return `Skills & tools: ${trainingData.skills}. Strong focus on React, Redux, and modern frontend engineering.`;
    }
    if (lowerMessage.includes('project')) return `Key projects: ${trainingData.projects}`;
    if (lowerMessage.includes('experience') || lowerMessage.includes('work')) return `Professional experience: ${trainingData.experience}`;
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
      return `You can reach me at ${trainingData.contact}. Open to new opportunities and collaborations.`;
    }
    if (lowerMessage.includes('education') || lowerMessage.includes('study')) return `Education: ${trainingData.education}`;
    if (lowerMessage.includes('who') || lowerMessage.includes('about')) {
      return `${trainingData.personalInfo.name} is a ${trainingData.personalInfo.title} based in ${trainingData.personalInfo.location}. ${trainingData.personalInfo.bio}`;
    }
    return "Ask me about skills, projects, experience, education, or contact info. What would you like to know?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMessage = { type: 'user', message: inputMessage };
    const botResponse = { type: 'bot', message: getAIResponse(inputMessage) };
    setChatMessages(prev => [...prev, userMessage, botResponse]);
    setInputMessage('');
  };

  useEffect(() => {
    const el = projectsContainerRef.current;
    if (!el) return;
  
    const io = new IntersectionObserver(
      ([entry]) => setProjectsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
  
    io.observe(el);
    return () => io.disconnect();
  }, []);
  
  useEffect(() => {
    const calc = () => {
      const strip = projectsStripRef.current;
      if (!strip) return;
      // Two copies in strip → half is the width of one list
      halfWidthRef.current = strip.scrollWidth / 2;
    };
    calc();
    window.addEventListener('resize', calc);
    // Recalc once images likely loaded
    const t = setTimeout(calc, 300);
    return () => {
      window.removeEventListener('resize', calc);
      clearTimeout(t);
    };
  }, [portfolioData.projects.length]);
  
    
  useEffect(() => {
    let rafId = null;
    const speed = 0.6; // px/frame (~36 px/s @60fps)
  
    const step = () => {
      const strip = projectsStripRef.current;
      if (strip) {
        const half = halfWidthRef.current || strip.scrollWidth / 2;
  
        // only advance when in view and not hovered
        if (projectsInView && !hoverRef.current) {
          offsetRef.current += speed;
          if (offsetRef.current >= half) offsetRef.current = 0; // seamless loop
        }
  
        strip.style.transform = `translateX(${-offsetRef.current}px)`;
      }
      rafId = requestAnimationFrame(step);
    };
  
    rafId = requestAnimationFrame(step);
    return () => rafId && cancelAnimationFrame(rafId);
  }, [projectsInView]); // <-- NOT depending on projectsHover anymore
  


  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg select-none">
          MK
        </h1>
          
          <nav className="hidden md:flex space-x-8">
            {['Home', 'About', 'Projects', 'Experience', 'Education', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="container mx-auto px-4 py-4 space-y-4">
              {['Home', 'About', 'Projects', 'Experience', 'Education', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className={`block hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="pt-20 pb-16 px-4">
        <Hero darkMode={darkMode}/>
      </section>

      {/* About (skills + tools separated, animated) */}
      <section id="about" className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>About Me</h2>
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <p className={`text-lg mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{portfolioData.bio}</p>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Location</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}><MapPin className="inline mr-1" size={16} />{portfolioData.location}</p>
                </div>
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Phone</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{portfolioData.phone}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Skills</h3>
              <div className="space-y-4">
                {(portfolioData.skills || []).map((s, i) => (
                  <ProgressBar key={i} label={s.name} level={s.level} darkMode={darkMode} gradient="from-blue-600 to-purple-600" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tools & Frameworks</h3>
              <div className="space-y-4">
                {(portfolioData.tools || []).map((t, i) => (
                  <ProgressBar key={i} label={t.name} level={t.level} darkMode={darkMode} gradient="from-purple-600 to-blue-600" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20">
        <h2 className={`text-4xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Featured Projects
        </h2>

        {/* Viewport: full width, no bg */}
        <div
          ref={projectsContainerRef}
          className="w-full overflow-hidden"
          aria-label="Featured Projects Marquee"
        >
          {/* Moving strip */}
          <div
            ref={projectsStripRef}
            className="flex gap-6 px-4 md:px-8 will-change-transform"
            onMouseEnter={() => { setProjectsHover(true); hoverRef.current = true; }}
            onMouseLeave={() => { setProjectsHover(false); hoverRef.current = false; }}
            onTouchStart={() => { setProjectsHover(true); hoverRef.current = true; }}
            onTouchEnd={() => { setProjectsHover(false); hoverRef.current = false; }}
            style={{ transform: 'translateX(0px)' }}
          >
            {/* First copy */}
            {portfolioData.projects.map((proj, idx) => (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => window.open(proj.liveUrl, '_blank', 'noopener,noreferrer')}
                onKeyDown={(e) => e.key === 'Enter' && window.open(proj.liveUrl, '_blank', 'noopener,noreferrer')}
                className="flex flex-col items-center"
              >
                <div
                  className={`group relative min-w-[280px] sm:min-w-[320px] md:min-w-[360px] lg:min-w-[350px] h-60
                    ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}
                    rounded-xl overflow-hidden border
                    ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                    cursor-pointer transform transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Tooltip overlay on hover */}
                  <div className="absolute inset-0 z-20 bg-black/80 text-white text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
                    <p className="mb-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Animated Arrow */}
                    <div className="absolute bottom-6 right-5 animate-bounce text-white text-xl opacity-90">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-12 h-12 rotate-320"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14M12 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Project title below card */}
                <h3 className={`mt-3 text-left w-full text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {proj.title}
                </h3>

              </div>
            ))}

            {/* Second copy for seamless loop */}
            {portfolioData.projects.map((proj, idx) => (
              <div
                key={`dup-${idx}`}
                role="button"
                tabIndex={0}
                onClick={() => window.open(proj.liveUrl, '_blank', 'noopener,noreferrer')}
                onKeyDown={(e) => e.key === 'Enter' && window.open(proj.liveUrl, '_blank', 'noopener,noreferrer')}
                className="flex flex-col items-center"
              >
                <div
                  className={`group relative min-w-[280px] sm:min-w-[320px] md:min-w-[360px] lg:min-w-[350px] h-60
                    ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}
                    rounded-xl overflow-hidden border
                    ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                    cursor-pointer transform transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Tooltip overlay on hover */}
                  <div className="absolute inset-0 z-20 bg-black/80 text-white text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
                    <p className="mb-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Animated Arrow */}
                    <div className="absolute bottom-6 right-5 animate-bounce text-white text-xl opacity-90">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-12 h-12 rotate-320"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14M12 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Project title below card */}
                <h3 className={`mt-3 text-left w-full text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {proj.title}
                </h3>

              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Experience with traveler (plane) */}
      <section id="experience" className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Experience</h2>
          <div ref={expTraveler.containerRef} className="relative max-w-3xl mx-auto">
            {/* traveler icon */}
            <div
              className="absolute left-0 -translate-x-1/2 z-10"
              style={{ top: expTraveler.topPx }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Plane size={20} className="text-white rotate-133"/>
              </div>
            </div>

            {portfolioData.experience.map((exp, index) => (
                <div
                  key={index}
                  data-timeline-item 
                  className={`relative pl-8 pb-12 ${index !== portfolioData.experience.length - 1 ? 'border-l-2 border-dashed border-blue-600' : ''}`}
                >
                  <div className="absolute left-0 -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-6 shadow-lg ml-4`}>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{exp.role}</h3>
                    <p className="text-blue-600 font-semibold mb-2">{exp.company}</p>
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{exp.period}</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{exp.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Education with traveler (car) */}
      <section id="education" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Education</h2>
          <div ref={eduTraveler.containerRef} className="relative max-w-3xl mx-auto">
            {/* traveler icon */}
            <div
              className="absolute left-0 -translate-x-1/2 z-10"
              style={{ top: eduTraveler.topPx }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                <Car size={20} className="text-white rotate-90" />
              </div>
            </div>

            {portfolioData.education.map((ed, idx) => (
              <div key={idx} data-timeline-item className={`relative pl-8 pb-12 ${idx !== portfolioData.education.length - 1 ? 'border-l-2 border-dashed border-purple-600' : ''}`}>
                <div className="absolute left-0 -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-6 shadow-lg ml-4`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ed.degree}</h3>
                  <p className="text-purple-600 font-semibold mb-2">{ed.school}</p>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ed.period}</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{ed.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Get In Touch</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Connecting the dots between creativity and communication—let’s collaborate and create something extraordinary.
            </p>
          </div>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology and innovation.
          </p>
          <div className="flex justify-center space-x-8 flex-wrap gap-4">
            <a href={`mailto:${portfolioData.email}`} className={`flex items-center px-8 py-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1`}>
              <Mail className="mr-3" size={20} /> {portfolioData.email}
            </a>
          </div>
          <div className="mt-10 flex justify-center gap-6">
            <a href={portfolioData.socials.linkedin} target="_blank" rel="noreferrer" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}>LinkedIn</a>
            <a href={portfolioData.socials.github} target="_blank" rel="noreferrer" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}>GitHub</a>
            <a href={portfolioData.socials.stackoverflow} target="_blank" rel="noreferrer" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}>StackOverflow</a>
            <a href={portfolioData.socials.quora} target="_blank" rel="noreferrer" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}>Quora</a>
          </div>
        </div>
      </section>

      {/* Chat Toggle */}
      <button onClick={() => setChatOpen(!chatOpen)} className="fixed cursor-pointer bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50">
        <MessageCircle size={24} className="mx-auto" />
      </button>

      {/* Chat */}
      {chatOpen && (
        <div className={`fixed bottom-24 right-6 w-80 md:w-96 h-96 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl z-50 flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-600 rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
              <button onClick={() => setChatOpen(false)} className="text-white cursor-pointer hover:text-gray-200"><X size={20} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-xs ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${msg.type === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {msg.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                  </div>
                  <div className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <button onClick={handleSendMessage} className="p-2 bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`py-8 px-4 ${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
        <div className="container mx-auto text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>© {new Date().getFullYear()} {portfolioData.name}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
