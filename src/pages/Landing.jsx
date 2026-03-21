import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, Flame, Target, Users, ShieldCheck, Heart, Sparkles, 
  MapPin, Calendar, BookOpen, Quote, Star, ChevronRight, User, Bell
} from 'lucide-react';
import Button from '../components/ui/Button';

// A playful 3D-like floating component wrapper
const FloatingElement = ({ children, delay = 0, yOffset = 20, duration = 4 }) => (
  <motion.div
    animate={{ y: [0, -yOffset, 0], rotate: [0, 2, -2, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {children}
  </motion.div>
);

const Landing = ({ onLoginClick }) => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

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
      
      {/* Playful Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-celestial/20 to-celestial-light/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-tr from-saffron/10 to-gold/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar overlay */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/60 backdrop-blur-2xl z-[100] flex items-center justify-between px-6 lg:px-12 shadow-sm border-b border-white/50">
        <div className="flex items-center gap-4">
           <img src="/logo.png" alt="Folkvizag Logo" className="h-10 w-auto object-contain drop-shadow-md transition-transform hover:scale-105" />
        </div>
        <div className="hidden md:flex items-center gap-8 bg-white/80 px-8 py-3 rounded-full shadow-sm border border-gray-100">
           {['Sadhana', 'Events', 'Stay', 'About'].map(item => (
             <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-black text-gray-500 hover:text-saffron transition-colors uppercase tracking-widest">{item}</a>
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

      {/* Cute 3D Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[95vh] flex items-center px-6 lg:px-12 pt-10 pb-20 z-10"
      >
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-10 order-2 lg:order-1 relative z-20"
          >
            <div className="inline-flex items-center gap-4 px-8 py-3.5 mb-2 bg-white/80 backdrop-blur-md rounded-full border border-saffron/20 shadow-xl shadow-saffron/5">
               <span className="flex h-3 w-3 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-saffron"></span>
               </span>
               <span className="text-xs font-black text-gray-800 uppercase tracking-[0.2em]">The Ultimate Spiritual App</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] font-black text-gray-900 tracking-tighter leading-[0.9] sm:leading-[0.85] drop-shadow-sm">
               YOUR <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-celestial to-blue-400">DIVINE</span> <br/>
               <span className="relative">
                 JOURNEY.
                 <svg className="absolute w-full h-4 -bottom-4 left-0 text-gold opacity-50" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/></svg>
               </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-xl">
               Experience the joy of devotion. From tracking daily sadhana to joining grand festivals, everything you need is right here.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
              <Button onClick={onLoginClick} className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-saffron to-gold text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-premium-xl group hover:shadow-saffron/30 hover:-translate-y-1 transition-all">
                 <div className="flex items-center gap-3 justify-center">
                    Enter Application <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </div>
              </Button>
              <div className="flex items-center gap-[-10px]">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://i.pravatar.cc/100?img=${i+40}`} alt="user" className="w-12 h-12 rounded-full border-4 border-[#FDF9F1] shadow-sm -ml-4 first:ml-0" />
                 ))}
                 <div className="ml-4 text-xs font-black text-gray-400 uppercase tracking-widest hidden sm:block">
                   Join 5,000+ others
                 </div>
              </div>
            </div>
          </motion.div>

          <div className="relative order-1 lg:order-2 h-[350px] sm:h-[600px] lg:h-[800px] flex items-center justify-center w-full">
             {/* The Cute Krishna Toy Asset */}
             <div className="absolute inset-0 z-10 flex items-center justify-center">
                <FloatingElement yOffset={30} duration={6}>
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                     animate={{ scale: 1, opacity: 1, rotate: 0 }}
                     transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
                     className="relative"
                   >
                     {/* Glossy Backdrop for that App Icon feel */}
                     <div className="absolute inset-4 bg-gradient-to-tr from-white/40 to-white/10 blur-3xl rounded-full -z-10"></div>
                     <img src="/krishna_toy.png" alt="Cute Krishna 3D" className="w-[240px] sm:w-[450px] md:w-[600px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(255,153,51,0.25)]" />
                   </motion.div>
                </FloatingElement>
             </div>

             {/* Floating App Modules Cards */}
             <motion.div 
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 1 }}
                className="absolute top-[5%] lg:top-[10%] right-[0%] lg:right-[10%] z-20 scale-75 lg:scale-100 origin-top-right"
             >
                <FloatingElement delay={0.2} yOffset={15} duration={5}>
                   <div className="bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] shadow-premium border border-white flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center"><Flame className="text-saffron" size={24} /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sadhana</p>
                         <p className="text-lg font-black text-gray-900 tracking-tight">16 Rounds Done!</p>
                      </div>
                   </div>
                </FloatingElement>
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-[2%] lg:bottom-[15%] left-[0%] md:left-[10%] z-20 scale-75 lg:scale-100 origin-bottom-left"
             >
                <FloatingElement delay={0.5} yOffset={20} duration={4.5}>
                   <div className="bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] shadow-premium border border-white flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center"><Calendar className="text-gold" size={24} /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Events</p>
                         <p className="text-lg font-black text-gray-900 tracking-tight">Kirtan Mela</p>
                      </div>
                   </div>
                </FloatingElement>
             </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Playful Stats Bar */}
      <section className="relative z-20 mt-4 lg:-mt-10 px-6 lg:px-12">
         <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-premium-xl p-8 lg:p-12 border border-gray-50 flex flex-wrap lg:flex-nowrap justify-between gap-10">
            {stats.map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left min-w-[200px]">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner">
                       {stat.icon}
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter tabular-nums">{stat.value}</h3>
                 </div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Features Showcase - Bento Grid Style */}
      <section id="sadhana" className="py-32 px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
        <div className="text-center space-y-4 mb-20">
           <span className="text-saffron font-black uppercase tracking-[0.3em] text-xs">Explore Features</span>
            <h2 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter">Everything You Need.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`group relative bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-50 flex flex-col items-start hover:-translate-y-2`}
             >
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-50 transition-opacity duration-700 ${f.color.split(' ')[0]}`} />
                
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:scale-110 shadow-sm ${f.color}`}>
                   {f.icon}
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{f.title}</h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-8 flex-1">{f.desc}</p>
                
                <button onClick={onLoginClick} className="mt-auto flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest group-hover:text-saffron transition-colors">
                   Explore Module <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </motion.div>
          ))}
        </div>
      </section>

      {/* App Preview / Interactive Feel Section */}
      <section id="events" className="py-20 lg:py-32 bg-white relative overflow-hidden rounded-[4rem] lg:rounded-[6rem] mx-4 lg:mx-12 mb-20 shadow-premium">
         <div className="absolute inset-0 bg-gradient-to-br from-celestial/5 to-transparent pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 relative z-10 p-4 lg:p-12">
               <div className="w-16 h-16 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-4">
                  <Star className="text-blue-500" fill="currentColor" size={32} />
               </div>
               <h2 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                  Vibrant <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-celestial">Festivals.</span>
               </h2>
               <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-md">
                  We don't just track your daily routine; we celebrate together. Join beautiful festivals, book your stays, and be part of our spiritual family.
               </p>
               <ul className="space-y-4 pt-4">
                 {['Easy and Fast Event Registration', 'Simple Temple Room Bookings', 'Live Updates on Temple Activities'].map((item, i) => (
                   <li key={i} className="flex items-center gap-4 text-sm font-black text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center"><CheckIcon className="text-blue-500" size={12} /></div>
                      {item}
                   </li>
                 ))}
               </ul>
            </div>
            
            <div className="relative h-[600px] sm:h-[700px] lg:h-[750px] w-full flex justify-center items-center perspective-1000 mt-10 lg:mt-0">
               {/* 3D App UI Mockup */}
               <motion.div 
                 initial={{ rotateY: 15, rotateX: 5 }}
                 whileInView={{ rotateY: -5, rotateX: 5 }}
                 transition={{ duration: 2, ease: "easeOut" }}
                 viewport={{ once: false, amount: 0.5 }}
                 className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] aspect-[9/19] bg-white rounded-[2.5rem] lg:rounded-[3rem] border-[6px] lg:border-[8px] border-gray-900 shadow-2xl overflow-hidden transform-gpu"
               >
                  {/* Mock UI Content */}
                  <div className="w-full h-full bg-[#fafafa] flex flex-col p-5 font-sans relative">
                     {/* Mock Header */}
                     <div className="flex justify-between items-center mb-5 mt-2">
                        <div className="flex items-center gap-2">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-gold p-0.5 shadow-sm">
                              <div className="w-full h-full bg-white rounded-full flex items-center justify-center"><User size={16} className="text-saffron" /></div>
                           </div>
                           <div className="flex flex-col"><span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Welcome back</span><span className="text-sm font-black text-gray-900 leading-none">Devotee</span></div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group cursor-pointer hover:bg-gray-50 transition-colors"><Bell size={14} className="group-hover:text-saffron transition-colors" /></div>
                     </div>
                     
                     <span className="text-lg font-black text-gray-900 tracking-tight mb-3">Featured Event</span>
                     
                     {/* Mock Featured Event */}
                     <div className="w-full h-32 bg-gray-900 rounded-3xl mb-5 relative overflow-hidden flex flex-col justify-end p-4 shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
                        <img src="https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=400" alt="event" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        <div className="relative z-20">
                           <span className="px-2 py-1 bg-saffron text-white text-[8px] font-black uppercase tracking-widest rounded-lg mb-1 inline-block shadow-sm">Yatras</span>
                           <h4 className="text-sm font-black text-white leading-tight italic uppercase tracking-tighter">Vrindavan Kartik Yatra 2026</h4>
                        </div>
                     </div>
                     
                     {/* Mock List */}
                     <span className="text-sm font-black text-gray-900 tracking-tight mb-3">Upcoming Schedules</span>
                     <div className="space-y-3 overflow-y-auto pb-24 scrollbar-hide flex-1">
                           <div className="w-full bg-white rounded-2xl shadow-sm p-3 flex items-center gap-3 border border-gray-50 cursor-pointer hover:shadow-md transition-shadow shrink-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50/50 rounded-xl flex flex-col items-center justify-center border border-blue-100"><Calendar size={12} className="text-blue-500 mb-0.5" /><span className="text-[8px] sm:text-[9px] font-black text-blue-700">Aug 15</span></div>
                              <div className="flex-1 overflow-hidden">
                                 <h5 className="text-[10px] sm:text-[11px] font-black text-gray-900 leading-tight uppercase italic tracking-tighter truncate">Maha Abhishek</h5>
                                 <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 flex items-center gap-1 mt-1 uppercase tracking-widest"><MapPin size={8} className="shrink-0" /> <span className="truncate">Main Temple</span></span>
                              </div>
                           </div>
                           <div className="w-full bg-white rounded-2xl shadow-sm p-3 flex items-center gap-3 border border-gray-50 cursor-pointer hover:shadow-md transition-shadow shrink-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-saffron/10 rounded-xl flex flex-col items-center justify-center border border-saffron/20"><Users size={12} className="text-saffron mb-0.5" /><span className="text-[8px] sm:text-[9px] font-black text-saffron">Sep 02</span></div>
                              <div className="flex-1 overflow-hidden">
                                 <h5 className="text-[10px] sm:text-[11px] font-black text-gray-900 leading-tight uppercase italic tracking-tighter truncate">Kirtan Mela</h5>
                                 <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 flex items-center gap-1 mt-1 uppercase tracking-widest"><MapPin size={8} className="shrink-0" /> <span className="truncate">Govinda Hall</span></span>
                              </div>
                           </div>
                     </div>

                     {/* Mock Bottom Nav Bar */}
                     <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] flex items-center justify-evenly pb-2">
                        <Target size={20} className="text-gray-300" />
                        <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg -mt-6">
                           <Calendar size={20} className="text-saffron drop-shadow-md" />
                        </div>
                        <Users size={20} className="text-gray-300" />
                     </div>
                  </div>
               </motion.div>
               {/* Decorative floating blur behind mockup */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/20 blur-[80px] rounded-full -z-10" />
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center relative max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-transparent pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[150px] -z-10" />
        </div>
        
        <div className="space-y-10 relative z-10 bg-white/60 backdrop-blur-3xl p-12 lg:p-20 rounded-[4rem] shadow-premium border border-white">
           <div className="w-20 h-20 bg-saffron rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl rotate-3">
              <Sparkles size={36} fill="currentColor" />
           </div>
           <h2 className="text-4xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9]">
              Begin Your <br/> <span className="italic font-serif font-medium text-saffron">Journey.</span>
           </h2>
           <p className="text-xl text-gray-500 font-medium max-w-xl mx-auto">
              Join Folk Vizag today. Track sadhana, book stays, attend events, and connect with a spiritual family.
           </p>
           <Button onClick={onLoginClick} className="px-14 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-premium-xl hover:bg-saffron hover:shadow-saffron/30 transition-all hover:-translate-y-1">
              Sign In to App
           </Button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-gray-100 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left bg-white">
          <div className="flex items-center gap-4">
             <img src="/logo.png" alt="Folkvizag Logo" className="h-8 w-auto object-contain drop-shadow-sm" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">&copy; {new Date().getFullYear()} Folkvizag. Empowering Devotees.</p>
          <div className="flex items-center gap-8">
             {['Privacy', 'Terms', 'Contact'].map(item => (
               <span key={item} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-saffron transition-colors cursor-pointer">{item}</span>
             ))}
          </div>
      </footer>
    </div>
  );
};

// Helper for the CheckIcon used in the list
const CheckIcon = ({ className, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Landing;

