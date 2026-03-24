import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  ArrowRight, Flame, Target, Users, ShieldCheck, Heart, Sparkles, 
  MapPin, Calendar, BookOpen, Quote, Star, ChevronRight, User, Bell,
  Award, Music, Coffee, Moon, CheckCircle2, Plus, Home
} from 'lucide-react';
import Button from '../components/ui/Button';
import { cn } from '../components/ui/Card';

// A playful 3D-like floating component wrapper
const FloatingElement = ({ children, delay = 0, yOffset = 20, duration = 4, rotateX = 0, rotateY = 0 }) => (
  <motion.div
    animate={{ 
      y: [0, -yOffset, 0], 
      rotate: [0, 2, -2, 0],
      rotateX: [rotateX, rotateX + 5, rotateX - 5, rotateX],
      rotateY: [rotateY, rotateY + 5, rotateY - 5, rotateY]
    }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    style={{ transformStyle: "preserve-3d" }}
  >
    {children}
  </motion.div>
);

const TilakDecoration = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 C45 30 45 50 50 90 C55 50 55 30 50 10" stroke="#FF9933" strokeWidth="2" fill="none" />
    <circle cx="50" cy="22" r="5" fill="#FF9933" />
  </svg>
);

const Landing = ({ onLoginClick }) => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Mouse parallax effect for 3D feel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [0, 800], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1400], [-5, 5]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const stats = [
    { label: 'Sadhana Streaks', value: '15,000+', icon: <Flame className="text-saffron" /> },
    { label: 'Active Devotees', value: '2,500+', icon: <Users className="text-blue-500" /> },
    { label: 'Events Hosted', value: '120+', icon: <Calendar className="text-gold" /> },
    { label: 'Temple Stays', value: '500+', icon: <MapPin className="text-green-500" /> }
  ];

  const features = [
    {
      title: 'Daily Sadhana',
      desc: 'Keep track of your daily chanting and spiritual routines in one simple place.',
      icon: <Target size={32} className="text-saffron" />,
      color: 'bg-saffron/10 border-saffron/20'
    },
    {
      title: 'Holy Events',
      desc: 'Find and join upcoming kirtans, yatras, and beautiful temple festivals.',
      icon: <Sparkles size={32} className="text-gold" />,
      color: 'bg-gold/10 border-gold/20'
    },
    {
      title: 'Accommodation',
      desc: 'Easily book rooms and temple stays for your spiritual retreats and visits.',
      icon: <MapPin size={32} className="text-blue-500" />,
      color: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Community',
      desc: 'Connect with other devotees, sharing inspiration, and spiritual wisdom daily.',
      icon: <Users size={32} className="text-green-500" />,
      color: 'bg-green-500/10 border-green-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F1] selection:bg-saffron/20 selection:text-saffron-dark overflow-x-hidden pt-20 text-left font-['Inter']">
      
      {/* Playful Ambient Background with Tilaks */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-celestial/20 to-celestial-light/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-tr from-saffron/10 to-gold/10 rounded-full blur-[120px]" />
         
         {/* Tilak Floating Elements */}
         <TilakDecoration className="absolute top-1/4 left-10 w-24 h-24 opacity-5 animate-pulse" />
         <TilakDecoration className="absolute bottom-1/4 right-20 w-32 h-32 opacity-[0.03] animate-bounce" />
         <TilakDecoration className="absolute top-1/2 left-1/2 w-48 h-48 opacity-[0.02] -translate-x-1/2 -translate-y-1/2 rotate-12" />
      </div>

      {/* Navbar overlay */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/60 backdrop-blur-2xl z-[100] flex items-center justify-between px-6 lg:px-12 shadow-sm border-b border-white/50">
        <div className="flex items-center gap-4">
           <img src="/logo.png" alt="Folkvizag Logo" className="h-10 w-auto object-contain drop-shadow-md transition-transform hover:scale-105 brightness-0 opacity-90" />
        </div>
        <div className="hidden md:flex items-center gap-8 bg-white/80 px-8 py-3 rounded-full shadow-sm border border-gray-100">
           {['Sadhana', 'Events', 'Stay', 'About'].map(item => (
             <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black text-gray-400 hover:text-saffron transition-colors uppercase tracking-[0.2em]">{item}</a>
           ))}
        </div>
        <div className="flex items-center gap-4">
           <Button onClick={onLoginClick} className="hidden sm:flex py-3 px-8 bg-gray-900 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-black shadow-xl hover:-translate-y-1 transition-all">
              Login to App
           </Button>
           <button onClick={onLoginClick} className="md:hidden w-12 h-12 rounded-full bg-saffron flex items-center justify-center text-white shadow-lg">
              <Users size={20} />
           </button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[95vh] flex items-center px-6 lg:px-12 pt-10 pb-20 z-10"
      >
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-10 order-2 lg:order-1 relative z-20"
          >
            <div className="inline-flex items-center gap-4 px-8 py-3.5 mb-2 bg-white/80 backdrop-blur-md rounded-full border border-saffron/20 shadow-xl shadow-saffron/5">
               <motion.span 
                 animate={{ scale: [1, 1.5, 1] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="flex h-3 w-3 rounded-full bg-saffron" 
               />
               <span className="text-[10px] font-black text-gray-800 uppercase tracking-[0.3em]">Spiritual Growth Platform</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-black text-gray-900 tracking-tighter leading-[0.9] sm:leading-[0.8] drop-shadow-sm font-cinzel">
               EMBRACE <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-br from-saffron via-gold to-saffron-dark animate-gradient-x">PURE</span> <br/>
               <span className="relative font-playfair italic font-medium text-saffron-dark drop-shadow-sm">
                 Devotion.
               </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
               Connect with your spiritual roots through Folk Vizag. A modern space for ancient wisdom, daily sadhana, and vibrant community festivals.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Button onClick={onLoginClick} className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-saffron to-gold text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-premium-2xl group hover:shadow-saffron/30 hover:-translate-y-1 transition-all">
                 <div className="flex items-center gap-3 justify-center">
                    Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </div>
              </Button>
              <div className="flex items-center -space-x-4">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://i.pravatar.cc/100?img=${i+44}`} alt="user" className="w-12 h-12 rounded-full border-4 border-white shadow-premium scale-100 hover:scale-110 hover:z-10 transition-transform cursor-pointer" />
                 ))}
                 <div className="pl-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   Trusted by 5k+ Devotees
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Redesigned 3D Krishna Hero Asset */}
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative order-1 lg:order-2 h-[450px] sm:h-[650px] lg:h-[850px] flex items-center justify-center w-full"
          >
             {/* The Cute Krishna Toy Asset with advanced layering */}
             <div className="absolute inset-0 z-10 flex items-center justify-center">
                <FloatingElement yOffset={40} duration={6}>
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                     animate={{ scale: 1, opacity: 1, rotate: 0 }}
                     transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
                     className="relative"
                   >
                     {/* Glossy Aura Backdrop */}
                     <div className="absolute inset-[-40px] bg-gradient-to-tr from-saffron/20 via-white/40 to-celestial/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
                     
                     <img 
                        src="/krishna_toy.png" 
                        alt="Cute Krishna 3D" 
                        className="w-[280px] sm:w-[500px] md:w-[650px] h-auto object-contain drop-shadow-[0_30px_60px_rgba(255,153,51,0.3)] select-none pointer-events-none" 
                     />
                     
                     {/* Playful Floating Particles */}
                     <motion.div 
                        animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }} 
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute top-10 right-10 w-4 h-4 rounded-full bg-gold shadow-lg" 
                     />
                     <motion.div 
                        animate={{ y: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                        className="absolute bottom-20 left-10 w-3 h-3 rounded-full bg-saffron shadow-lg" 
                     />
                   </motion.div>
                </FloatingElement>
             </div>

             {/* 3D Floating Module Cards */}
             <motion.div 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="absolute top-[10%] right-[5%] z-20 scale-90 lg:scale-110"
             >
                <FloatingElement delay={0.2} yOffset={15} duration={5} rotateX={10} rotateY={-10}>
                   <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-premium-2xl border border-white/50 flex items-center gap-5 cursor-pointer hover:-translate-y-2 transition-transform tilak-card">
                      <div className="w-14 h-14 bg-gradient-to-br from-saffron/20 to-saffron/5 rounded-2xl flex items-center justify-center border border-saffron/10"><Flame className="text-saffron" size={28} /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Live Activity</p>
                         <p className="text-xl font-black text-gray-900 tracking-tight">16 Rounds Chanted</p>
                      </div>
                   </div>
                </FloatingElement>
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                className="absolute bottom-[10%] left-[5%] z-20 scale-90 lg:scale-110"
             >
                <FloatingElement delay={0.5} yOffset={20} duration={4.5} rotateX={-10} rotateY={10}>
                   <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-premium-2xl border border-white/50 flex items-center gap-5 cursor-pointer hover:-translate-y-2 transition-transform tilak-card">
                      <div className="w-14 h-14 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center border border-gold/10"><Calendar className="text-gold" size={28} /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Upcoming Event</p>
                         <p className="text-xl font-black text-gray-900 tracking-tight">Kartik Mela 2026</p>
                      </div>
                   </div>
                </FloatingElement>
             </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section with Glassmorphism */}
      <section className="relative z-20 mt-4 lg:-mt-20 px-6 lg:px-12 pb-20">
         <div className="max-w-7xl mx-auto glass-card p-10 lg:p-16 flex flex-wrap lg:flex-nowrap justify-between gap-12 border-white shadow-premium-2xl">
            {stats.map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left min-w-[200px] group">
                 <div className="flex items-center gap-5 mb-5">
                    <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                       {React.cloneElement(stat.icon, { size: 28 })}
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter tabular-nums drop-shadow-sm">{stat.value}</h3>
                 </div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] font-poppins">{stat.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Bento Grid Features */}
      <section id="sadhana" className="py-40 px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
        <div className="text-center space-y-6 mb-24 max-w-2xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="inline-block px-6 py-2 bg-saffron/10 rounded-full text-saffron text-[10px] font-black uppercase tracking-[0.3em] border border-saffron/20"
           >
             App Ecosystem
           </motion.div>
            <h2 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter font-cinzel leading-tight">
               Built for the <br/> <span className="text-saffron">Spiritual</span> Heart.
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((f, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white p-12 rounded-[3.5rem] shadow-premium-xl hover:shadow-premium-2xl transition-all duration-700 overflow-hidden border border-gray-50 flex flex-col items-start hover:-translate-y-3 tilak-card"
             >
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 ${f.color.split(' ')[0]}`} />
                
                <div className={cn(
                  "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 border transition-all duration-500 group-hover:rotate-12 shadow-sm bg-white",
                  f.color
                )}>
                   {f.icon}
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-5 tracking-tight font-poppins">{f.title}</h3>
                <p className="text-[13px] font-medium text-gray-500 leading-relaxed mb-10 flex-1">{f.desc}</p>
                
                <button onClick={onLoginClick} className="mt-auto flex items-center gap-3 text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] group-hover:text-saffron transition-colors">
                   Enter Module <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive App Mockup Section */}
      <section id="events" className="py-32 lg:py-48 bg-gray-900 relative overflow-hidden rounded-[5rem] lg:rounded-[8rem] mx-4 lg:mx-12 mb-32 shadow-2xl">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
         <div className="absolute top-0 right-0 p-20 text-white/5 opacity-10"><TilakDecoration className="w-96 h-96" /></div>
         
         <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10 relative z-10 p-4">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mb-6 border border-white/10 shadow-xl">
                  <Heart className="text-red-400" fill="currentColor" size={32} />
               </div>
               <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] font-cinzel">
                  Vibrant <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-gold">Community.</span>
               </h2>
               <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-md">
                  Experience a digital sanctuary designed to foster your spiritual connection with the global family of devotees.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                 {[
                   { icon: <CheckCircle2 className="text-saffron" size={20} />, label: 'Event Bookings' },
                   { icon: <CheckCircle2 className="text-gold" size={20} />, label: 'Digital ID Card' },
                   { icon: <CheckCircle2 className="text-blue-400" size={20} />, label: 'Stay Approvals' },
                   { icon: <CheckCircle2 className="text-green-400" size={20} />, label: 'Sadhana Streaks' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 text-xs font-black text-white uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                      {item.icon}
                      {item.label}
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="relative h-[650px] sm:h-[800px] w-full flex justify-center items-center perspective-1000">
               {/* 3D App UI Mockup with glow */}
               <motion.div 
                 initial={{ rotateY: 20, rotateX: 5 }}
                 whileInView={{ rotateY: -10, rotateX: 5 }}
                 transition={{ duration: 2, ease: "easeOut" }}
                 className="relative w-full max-w-[340px] aspect-[9/19] bg-white rounded-[3.5rem] border-[10px] border-gray-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transform-gpu"
               >
                  {/* Digital Mock UI */}
                  <div className="w-full h-full bg-cream flex flex-col p-6 font-sans relative">
                     <div className="flex justify-between items-center mb-8 px-2 mt-4">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron to-gold p-0.5 shadow-lg">
                              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                                 <img src="https://api.dicebear.com/7.x/initials/svg?seed=Devotee&backgroundColor=ff9933" className="w-full h-full object-cover" alt="" />
                              </div>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">Member</span>
                              <span className="text-base font-black text-gray-900 leading-none tracking-tight">Haribol!</span>
                           </div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-gray-50 text-saffron"><Bell size={18} /></div>
                     </div>
                     
                     {/* Mock ID Card Component */}
                     <div className="w-full h-48 bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] mb-8 relative overflow-hidden p-6 shadow-2xl ring-1 ring-white/10">
                        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><TilakDecoration className="w-32 h-32" /></div>
                        <div className="flex justify-between items-start">
                           <img src="/logo.png" className="h-6 w-auto brightness-0 invert opacity-50" alt="" />
                           <Star size={20} className="text-gold" fill="currentColor" />
                        </div>
                        <div className="mt-12">
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Devotee Pass</p>
                           <h4 className="text-lg font-black text-white tracking-tight uppercase italic">Digital Identity</h4>
                        </div>
                        <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                           <div className="w-full h-full grid grid-cols-2 gap-0.5"><div className="bg-gray-900"/><div className="bg-gray-400"/><div className="bg-gray-400"/><div className="bg-gray-900"/></div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Quick Access</p>
                        {[
                           { label: 'Register Event', icon: <Plus size={16} />, bg: 'bg-white' },
                           { label: 'View QR Pass', icon: <Users size={16} />, bg: 'bg-white' },
                           { label: 'Stay Status', icon: <Home size={16} />, bg: 'bg-white' }
                        ].map((item, i) => (
                           <div key={i} className={cn("p-4 rounded-3xl flex items-center justify-between shadow-sm border border-gray-50 cursor-pointer hover:shadow-md transition-all", item.bg)}>
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-saffron font-bold border border-gray-100">{item.icon}</div>
                                 <span className="text-sm font-black text-gray-800 tracking-tight">{item.label}</span>
                              </div>
                              <ChevronRight size={14} className="text-gray-300" />
                           </div>
                        ))}
                     </div>

                     {/* Tab Bar Mini */}
                     <div className="absolute bottom-6 left-6 right-6 h-16 bg-white/80 backdrop-blur-xl rounded-full shadow-premium border border-white flex items-center justify-around px-2">
                        <div className="w-10 h-10 rounded-full bg-saffron text-white flex items-center justify-center shadow-lg"><Flame size={18} /></div>
                        <Calendar size={18} className="text-gray-300" />
                        <Home size={18} className="text-gray-300" />
                        <User size={18} className="text-gray-300" />
                     </div>
                  </div>
               </motion.div>
               
               {/* Decorative glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-saffron/10 blur-[120px] rounded-full -z-10 animate-pulse" />
            </div>
         </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-48 px-6 text-center relative max-w-6xl mx-auto overflow-hidden">
        <div className="absolute inset-0 z-0">
           <TilakDecoration className="absolute -top-20 -left-20 w-[400px] h-[400px] opacity-[0.02]" />
           <TilakDecoration className="absolute -bottom-20 -right-20 w-[400px] h-[400px] opacity-[0.02] rotate-180" />
        </div>
        
        <motion.div 
           whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
           transition={{ duration: 1 }}
           className="space-y-12 relative z-10 bg-white p-16 lg:p-32 rounded-[5rem] shadow-premium-2xl border border-white/50"
        >
           <div className="w-24 h-24 bg-gradient-to-br from-saffron to-gold rounded-[2.5rem] flex items-center justify-center mx-auto text-white shadow-premium-xl rotate-6 animate-bounce">
              <Sparkles size={48} fill="currentColor" />
           </div>
           
           <h2 className="text-5xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.85] font-cinzel">
              YOUR TIME <br/> <span className="text-saffron italic font-playfair font-medium">Is Now.</span>
           </h2>
           
           <p className="text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Step into a more connected, organized, and inspired spiritual life. The community is waiting for you.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
              <Button onClick={onLoginClick} className="px-16 py-7 bg-gray-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-premium-2xl hover:bg-saffron hover:shadow-saffron/30 transition-all hover:-translate-y-2">
                 Join the Mission
              </Button>
              <Button variant="secondary" onClick={onLoginClick} className="px-16 py-7 border-2 border-gray-100 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-gray-50 transition-all">
                 Explore App
              </Button>
           </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-100 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left bg-white">
          <div className="flex flex-col items-center md:items-start gap-4">
             <img src="/logo.png" alt="Folkvizag Logo" className="h-10 w-auto object-contain drop-shadow-sm brightness-0 opacity-100" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] max-w-[200px] leading-loose">Spreading ancient wisdom through modern experiences.</p>
          </div>
          
          <div className="flex gap-16">
             <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2">Modules</span>
                {['Sadhana', 'Events', 'Accommodation'].map(item => (
                  <span key={item} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-saffron transition-colors cursor-pointer">{item}</span>
                ))}
             </div>
             <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2">Legal</span>
                {['Privacy', 'Security', 'Terms'].map(item => (
                  <span key={item} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-saffron transition-colors cursor-pointer">{item}</span>
                ))}
             </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex gap-4">
                 {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-saffron transition-colors cursor-pointer shadow-sm hover:shadow-md"><Music size={18} /></div>)}
              </div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">&copy; {new Date().getFullYear()} FOLK VIZAG</p>
          </div>
      </footer>
    </div>
  );
};

// Simplified CheckIcon replacement with Lucide CheckCircle2 for better premium look
const CheckIcon = ({ className, size }) => (
  <CheckCircle2 size={size} className={className} />
);

export default Landing;
