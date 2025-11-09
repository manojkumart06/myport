import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Moon, Sun, Menu, X, Mail,
  MessageCircle, Send, User, Bot, ChevronLeft, ChevronRight,
  MapPin
} from 'lucide-react';
import portfolioData from './data/portfolioData.json';
import ProgressBar from './components/ProgressBar';
import Hero from './components/Hero';
import AnimatedGradient from './components/AnimatedGradient';
import ParticleBackground from './components/ParticleBackground';
import GridBackground from './components/GridBackground';
import WaveBackground from './components/WaveBackground';
import GeometricBackground from './components/GeometricBackground';
import FloatingLights from './components/FloatingLights';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m an AI assistant trained on this portfolio. Ask me anything!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  

// Projects row: translateX-based marquee (persist offset across renders)
const projectsContainerRef = useRef(null); // viewport
const projectsStripRef = useRef(null);     // moving strip

const [projectsInView, setProjectsInView] = useState(false);

// Refs that drive animation logic (don't trigger re-renders)
const hoverRef = useRef(false);
const offsetRef = useRef(0);
const halfWidthRef = useRef(0);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // AI Training Data (auto-built from real data) - Memoized to prevent recalculation on every render
  const trainingData = useMemo(() => ({
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
  }), []);

  const getAIResponse = useCallback((message) => {
    const lowerMessage = message.toLowerCase();

    // Skills & Technologies
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech stack') || lowerMessage.includes('tools')) {
      const skills = portfolioData.skills.slice(0, 5).map(s => `• ${s.name}`).join('\n');
      const tools = portfolioData.tools.slice(0, 3).map(t => `• ${t.name}`).join('\n');
      return `**Key Skills:**\n${skills}\n\n**Tools:**\n${tools}`;
    }

    // Projects
    if (lowerMessage.includes('project')) {
      const projects = portfolioData.projects.slice(0, 3).map(p =>
        `• **${p.title}**: ${p.description.substring(0, 80)}...`
      ).join('\n');
      return `**Featured Projects:**\n${projects}`;
    }

    // Experience & Work
    if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job')) {
      const exp = portfolioData.experience.slice(0, 2).map(e =>
        `• **${e.role}** at ${e.company} (${e.period})`
      ).join('\n');
      return `**Professional Experience:**\n${exp}`;
    }

    // Contact & Hiring
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('available')) {
      return `**Contact Info:**\n• Email: ${portfolioData.email}\n• Phone: ${portfolioData.phone}\n• Location: ${portfolioData.location}\n\nOpen to new opportunities!`;
    }

    // Education
    if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('degree') || lowerMessage.includes('university')) {
      const edu = portfolioData.education.map(e =>
        `• **${e.degree}** - ${e.school} (${e.period})`
      ).join('\n');
      return `**Education:**\n${edu}`;
    }

    // About/Bio
    if (lowerMessage.includes('who') || lowerMessage.includes('about') || lowerMessage.includes('introduce')) {
      return `**About ${trainingData.personalInfo.name}:**\n• ${trainingData.personalInfo.title}\n• Based in ${trainingData.personalInfo.location}\n• ${trainingData.personalInfo.bio}`;
    }

    // Location
    if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('based')) {
      return `**Location:** ${portfolioData.location}`;
    }

    // Interests/Focus
    if (lowerMessage.includes('interest') || lowerMessage.includes('passion') || lowerMessage.includes('focus')) {
      return `**Areas of Interest:**\n• Frontend Development\n• React & Redux\n• UI/UX Design\n• Web Performance\n• Modern JavaScript`;
    }

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! I'm here to help. Ask me about:\n• Skills & technologies\n• Projects\n• Experience\n• Education\n• Contact info`;
    }

    // Default fallback
    return "I can help with:\n• Skills & tools\n• Projects\n• Work experience\n• Education\n• Contact information\n\nWhat would you like to know?";
  }, [trainingData.personalInfo]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', message: inputMessage };
    const currentInput = inputMessage;

    // Add user message and show typing indicator
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate thinking time (500ms - 1000ms)
    setTimeout(() => {
      const botResponse = { type: 'bot', message: getAIResponse(currentInput) };
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 500 + Math.random() * 500);
  };

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Scroll animation for cards
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-animate="scroll"]');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
      <header className={`fixed w-full z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95" onClick={() => scrollToSection('home')}>
          <img
            src="./Media/mkLogo.png"
            alt="MK Logo"
            className="h-10 w-10 md:h-12 md:w-12 select-none drop-shadow-lg"
            style={{ filter: 'brightness(0) saturate(100%) invert(47%) sepia(46%) saturate(1245%) hue-rotate(142deg) brightness(93%) contrast(92%)' }}
          />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent drop-shadow-lg select-none">
            ManojKumar
          </h1>
        </div>
          
          <nav className="hidden md:flex space-x-8">
            {['Home', 'About', 'Projects', 'Experience', 'Education', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`hover:text-teal-500 transition-all duration-200 active:scale-95 active:text-teal-600 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 text-cyan-400' : 'bg-gray-100 text-gray-600'}`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <nav className="container mx-auto px-4 py-4 space-y-4">
              {['Home', 'About', 'Projects', 'Experience', 'Education', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className={`block hover:text-teal-500 transition-all duration-200 active:scale-95 active:text-teal-600 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative pt-20 pb-16 px-4 overflow-hidden">
        <ParticleBackground darkMode={darkMode} particleCount={60} />
        <div className="relative z-10">
          <Hero darkMode={darkMode}/>
        </div>
      </section>

      {/* About (skills + tools separated, animated) */}
      <section id="about" className={`relative py-20 px-4 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <GridBackground darkMode={darkMode} />
        <div className="container mx-auto relative z-10">
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
                  <ProgressBar key={i} label={s.name} level={s.level} darkMode={darkMode} gradient="from-teal-600 to-cyan-500" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tools & Frameworks</h3>
              <div className="space-y-4">
                {(portfolioData.tools || []).map((t, i) => (
                  <ProgressBar key={i} label={t.name} level={t.level} darkMode={darkMode} gradient="from-teal-600 to-cyan-500" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="relative py-30 overflow-hidden">
        <WaveBackground darkMode={darkMode} />
        <div className="relative z-10">
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
            onMouseEnter={() => { hoverRef.current = true; }}
            onMouseLeave={() => { hoverRef.current = false; }}
            onTouchStart={() => { hoverRef.current = true; }}
            onTouchEnd={() => { hoverRef.current = false; }}
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
                    hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500`}
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
                          className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r bg-[#0f9eb0] text-white"
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
                    hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500`}
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
                          className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r bg-[#0f9eb0] text-white"
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
        </div>
      </section>


      {/* Experience */}
      <section id="experience" className={`relative py-20 px-4 overflow-x-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <FloatingLights darkMode={darkMode} />
        <div className="container mx-auto relative z-10">
          <h2 className={`text-4xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Experience</h2>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-0">
            {portfolioData.experience.map((exp, index) => (
                <div
                  key={index}
                  data-timeline-item
                  className="relative pb-12 opacity-0 translate-y-8 transition-all duration-700 ease-out"
                  data-animate="scroll"
                >
                  {/* Enhanced Card */}
                  <div className={`group relative rounded-xl p-4 sm:p-6 transition-all duration-300
                    ${darkMode
                      ? 'bg-gradient-to-br from-gray-700 via-gray-700 to-gray-800 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800'
                      : 'bg-gradient-to-br from-white via-white to-gray-50 hover:from-white hover:via-gray-50 hover:to-white'
                    }
                    shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(15,158,176,0.3)]
                    border ${darkMode ? 'border-gray-600 hover:border-teal-500/50' : 'border-gray-200 hover:border-teal-500/30'}
                    hover:-translate-y-2 hover:scale-[1.02] cursor-pointer
                    backdrop-blur-sm`}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      bg-gradient-to-r from-transparent via-teal-500/5 to-transparent
                      group-hover:animate-[shimmer_2s_ease-in-out_infinite]"
                    />

                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-t-xl
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}
                          group-hover:text-teal-500 transition-colors duration-300`}>
                          {exp.role}
                        </h3>
                        {/* Badge */}
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full w-fit
                          ${darkMode ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600'}
                          border ${darkMode ? 'border-teal-500/30' : 'border-teal-200'}`}>
                          Professional
                        </span>
                      </div>

                      <p className="text-teal-600 dark:text-teal-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        {exp.company}
                      </p>

                      <p className={`text-sm mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {exp.period}
                      </p>

                      <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {exp.description}
                      </p>
                    </div>

                    {/* Bottom gradient reflection */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="relative py-20 px-4 overflow-x-hidden">
        <GeometricBackground darkMode={darkMode} />
        <div className="container mx-auto relative z-10">
          <h2 className={`text-4xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Education</h2>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-0">
            {portfolioData.education.map((ed, idx) => (
              <div
                key={idx}
                data-timeline-item
                className="relative pb-12 opacity-0 translate-y-8 transition-all duration-700 ease-out"
                data-animate="scroll"
              >
                {/* Enhanced Card */}
                <div className={`group relative rounded-xl p-4 sm:p-6 transition-all duration-300
                  ${darkMode
                    ? 'bg-gradient-to-br from-gray-700 via-gray-700 to-gray-800 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800'
                    : 'bg-gradient-to-br from-white via-white to-gray-50 hover:from-white hover:via-gray-50 hover:to-white'
                  }
                  shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(15,158,176,0.3)]
                  border ${darkMode ? 'border-gray-600 hover:border-teal-500/50' : 'border-gray-200 hover:border-teal-500/30'}
                  hover:-translate-y-2 hover:scale-[1.02] cursor-pointer
                  backdrop-blur-sm`}
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    bg-gradient-to-r from-transparent via-teal-500/5 to-transparent
                    group-hover:animate-[shimmer_2s_ease-in-out_infinite]"
                  />

                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-t-xl
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}
                        group-hover:text-teal-500 transition-colors duration-300`}>
                        {ed.degree}
                      </h3>
                      {/* Badge */}
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full w-fit
                        ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'}
                        border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
                        Academic
                      </span>
                    </div>

                    <p className="text-teal-600 dark:text-teal-400 font-semibold mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                      {ed.school}
                    </p>

                    <p className={`text-sm mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {ed.period}
                    </p>

                    <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {ed.description}
                    </p>
                  </div>

                  {/* Bottom gradient reflection */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-16 px-4 overflow-hidden">
        <AnimatedGradient darkMode={darkMode} colors={[
          { r: 15, g: 158, b: 176, a: 0.2 },
          { r: 139, g: 92, b: 246, a: 0.2 },
          { r: 236, g: 72, b: 153, a: 0.2 }
        ]} />
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Get In Touch</h2>
            <div className="w-20 h-1 bg-[#0f9eb0] mx-auto mb-6"></div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Connecting the dots between creativity and communication—let's collaborate and create something extraordinary.
            </p>
          </div>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology and innovation.
          </p>
          <div className="flex justify-center space-x-8 flex-wrap gap-4">
            <a href={`mailto:${portfolioData.email}`} className={`flex items-center px-8 py-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 active:scale-95`}>
              <Mail className="mr-3" size={20} /> {portfolioData.email}
            </a>
          </div>
          <div className="mt-10 flex justify-center gap-6">
            <a href={portfolioData.socials.linkedin} target="_blank" rel="noreferrer" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-teal-500 transition-all duration-200 active:scale-90 active:text-teal-600`}>LinkedIn</a>
            <a href={portfolioData.socials.github} target="_blank" rel="noreferrer" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-teal-500 transition-all duration-200 active:scale-90 active:text-teal-600`}>GitHub</a>
            <a href={portfolioData.socials.stackoverflow} target="_blank" rel="noreferrer" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-teal-500 transition-all duration-200 active:scale-90 active:text-teal-600`}>StackOverflow</a>
            <a href={portfolioData.socials.quora} target="_blank" rel="noreferrer" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-teal-500 transition-all duration-200 active:scale-90 active:text-teal-600`}>Quora</a>
          </div>
        </div>
      </section>

      {/* Chat Toggle */}
      <button onClick={() => setChatOpen(!chatOpen)} className="fixed cursor-pointer bottom-6 right-6 w-16 h-16 bg-[#0f9eb0] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-50">
        <MessageCircle size={24} className="mx-auto" />
      </button>

      {/* Chat */}
      {chatOpen && (
        <div className={`fixed bottom-24 right-6 w-80 md:w-96 h-96 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl z-50 flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-600 rounded-t-2xl bg-[#0f9eb0]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
              <button onClick={() => setChatOpen(false)} className="text-white cursor-pointer hover:text-gray-200 active:scale-90 transition-transform"><X size={20} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-xs ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${msg.type === 'user' ? 'bg-teal-600' : 'bg-teal-500'}`}>
                    {msg.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                  </div>
                  <div className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-teal-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm whitespace-pre-line">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-xs">
                  <div className="p-2 rounded-full bg-teal-500">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <button onClick={handleSendMessage} className="p-2 bg-[#0f9eb0] cursor-pointer text-white rounded-lg hover:shadow-lg transition-all duration-300 active:scale-95">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`relative py-4 px-4 overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center space-y-3">
            {/* Copyright */}
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} {portfolioData.name}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;