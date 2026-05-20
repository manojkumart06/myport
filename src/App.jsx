
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Menu, X, Mail,
  MessageCircle, Send, User, Bot,
} from 'lucide-react';
import portfolioData from './data/portfolioData.json';
import AnimatedGradient from './components/AnimatedGradient';
import ParticleBackground from './components/ParticleBackground';
import CinematicBackground from './components/CinematicBackground';
import GridBackground from './components/GridBackground';
import OrbitalBackground from './components/OrbitalBackground';
import WaveBackground from './components/WaveBackground';
import GeometricBackground from './components/GeometricBackground';
import FloatingLights from './components/FloatingLights';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import StackSection from './components/StackSection';
import ProjectsStack from './components/ProjectsStack';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import ContactSection from './components/ContactSection';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m an AI assistant trained on this portfolio. Ask me anything!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Scrollspy: whichever section's top is closest above an "active line"
  // near the top of the viewport becomes the active nav item.
  useEffect(() => {
    const ids = ['about', 'services', 'stack', 'projects', 'experience', 'education', 'contact'];

    const onScroll = () => {
      const activeLine = window.scrollY + window.innerHeight * 0.28;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        // absolute top of the section in the document
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= activeLine) current = id;
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById('home');
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setHeroInView(e.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const chatEndRef = useRef(null);
  

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


  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-[#0C0C0C]' : 'bg-white'}`}>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-all duration-300 ${
          scrolled
            ? 'py-4 md:py-5 bg-[#0C0C0C]/85 backdrop-blur-md border-b border-[#D7E2EA]/10'
            : 'pt-6 md:pt-8 pb-4'
        }`}
      >
        <div className="flex items-center justify-between gap-6">
          <nav className="hidden md:flex flex-1 justify-between items-center max-w-2xl">
            {['About', 'Services', 'Stack', 'Projects', 'Experience', 'Education', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`nav-cta-hover font-medium uppercase tracking-wider text-sm md:text-base lg:text-[1.1rem] transition-colors duration-200 ${activeSection === item.toLowerCase() ? 'nav-cta-active' : 'text-[#D7E2EA]'}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full cursor-pointer transition-colors text-[#D7E2EA] hover:bg-[#D7E2EA]/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 rounded-2xl backdrop-blur-md bg-[#0C0C0C]/80 border border-[#D7E2EA]/10 p-6">
            <nav className="flex flex-col gap-4">
              {['About', 'Services', 'Stack', 'Projects', 'Experience', 'Education', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`nav-cta-hover font-medium uppercase tracking-wider text-base transition-colors duration-200 ${activeSection === item.toLowerCase() ? 'nav-cta-active' : 'text-[#D7E2EA]'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative min-h-screen overflow-hidden">
        <CinematicBackground darkMode={darkMode} />
        <div className="relative z-10 w-full h-full">
          <Hero darkMode={darkMode}/>
        </div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* About */}
      <AboutSection />

      {/* Services */}
      <ServicesSection />

      {/* Stack */}
      <StackSection />

      {/* Projects */}
      <ProjectsStack />

      {/* Experience */}
      <ExperienceSection />

      {/* Education */}
      <EducationSection />

      {/* Contact */}
      <ContactSection />

      {/* Chat Toggle — hidden over Hero so it doesn't fight the Contact CTA */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={`fixed cursor-pointer bottom-6 right-6 w-16 h-16 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-110 active:scale-95 z-50 ${heroInView && !chatOpen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}
        style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)', boxShadow: '0 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset' }}
      >
        <MessageCircle size={24} className="mx-auto" />
      </button>

      {/* Chat */}
      {chatOpen && (
        <div className={`fixed bottom-24 right-6 w-80 md:w-96 h-96 ${darkMode ? 'bg-zinc-900' : 'bg-white'} rounded-2xl shadow-2xl z-50 flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-600 rounded-t-2xl" style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
              <button onClick={() => setChatOpen(false)} className="text-white cursor-pointer hover:text-gray-200 active:scale-90 transition-transform"><X size={20} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-xs ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div
                    className="p-2 rounded-full"
                    style={msg.type === 'user'
                      ? { background: '#646973' }
                      : { background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)', boxShadow: '0 2px 6px rgba(181, 1, 167, 0.35), 2px 2px 6px #7721B1 inset' }}
                  >
                    {msg.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                  </div>
                  <div className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-[#646973] text-white' : darkMode ? 'bg-zinc-800 text-gray-300' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm whitespace-pre-line">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-xs">
                  <div
                    className="p-2 rounded-full"
                    style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)', boxShadow: '0 2px 6px rgba(181, 1, 167, 0.35), 2px 2px 6px #7721B1 inset' }}
                  >
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
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
                className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7E2EA] ${darkMode ? 'bg-zinc-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <button onClick={handleSendMessage} className="p-2 cursor-pointer text-white rounded-lg hover:shadow-lg transition-all duration-300 active:scale-95" style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)' }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`relative py-4 px-4 overflow-hidden ${darkMode ? 'bg-[#0C0C0C]' : 'bg-gray-100'}`}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D7E2EA]/10 via-transparent to-[#D7E2EA]/10 pointer-events-none" />

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

