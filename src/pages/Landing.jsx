import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Target, Users, ShieldCheck, Heart, Sparkles, Zap, ChevronDown, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Tilak = ({ className }) => (
  <svg viewBox="0 0 100 200" fill="currentColor" className={className}>
    <path d="M40 20 L40 150 Q40 180 50 180 Q60 180 60 150 L60 20" />
    <path d="M50 160 Q50 140 40 130 Q30 140 30 160 Q30 180 40 190 Q50 200 60 190 Q70 180 70 160 Q70 140 60 130 Q50 140 50 160" />
  </svg>
);

const Landing = ({ onLoginClick }) => {
  const stats = [
    { label: 'Rounds Tracked', value: '25,000+', icon: <Flame className="text-saffron" /> },
    { label: 'Devotees Connected', value: '450+', icon: <Users className="text-gold" /> },
    { label: 'Events Hosted', value: '80+', icon: <Sparkles className="text-blue-500" /> },
    { label: 'Active Streaks', value: '120+', icon: <Zap className="text-red-500" /> }
  ];

  const features = [
    {
      title: 'Track Your Rounds',
      desc: 'Set a daily target and record your progress every morning. Simple and easy to use.',
      icon: <Target size={32} className="text-saffron" />
    },
    {
      title: 'Join Holy Events',
      desc: 'Register for upcoming yatras, kirtans and seminars with a single click.',
      icon: <Users size={32} className="text-gold" />
    },
    {
      title: 'Stay Consistent',
      desc: 'Keep your streak alive and earn merit points as you reach your spiritual goals.',
      icon: <Zap size={32} className="text-blue-500" />
    }
  ];

  const steps = [
    { step: '01', title: 'Sign In', desc: 'Securely login using your phone number or email.' },
    { step: '02', title: 'Set Target', desc: 'Decide how many rounds you want to do each day.' },
    { step: '03', title: 'Log Daily', desc: 'Record your rounds every morning to keep your streak.' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-saffron/20 selection:text-saffron-dark overflow-x-hidden pt-20 text-left">
      {/* Navbar Overlay */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-gray-100 bg-white/80 backdrop-blur-xl z-[100] flex items-center justify-between px-6 lg:px-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-saffron to-gold rounded-xl flex items-center justify-center shadow-lg">
             <Heart className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Folkvizag</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
           {['Features', 'Process', 'Impact'].map(item => (
             <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-black text-gray-400 hover:text-saffron transition-colors uppercase tracking-widest">{item}</a>
           ))}
           <Button onClick={onLoginClick} className="py-2.5 px-6 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl">
              Sign In
           </Button>
        </div>
        <button onClick={onLoginClick} className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
           <Users size={18} />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 lg:px-20 py-20 overflow-hidden">
        {/* Tilak Watermarks */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-10 text-saffron/5 pointer-events-none -rotate-12 hidden xl:block"
        >
           <Tilak className="w-[300px] h-auto" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-[30%] text-gold/5 pointer-events-none rotate-12"
        >
           <Tilak className="w-[400px] h-auto" />
        </motion.div>

        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-saffron/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-7 space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-saffron/10 text-saffron rounded-full border border-saffron/20 shadow-sm">
               <Sparkles size={16} />
               <span className="text-[11px] font-black uppercase tracking-[0.2em]">Spiritual Growth Made Simple</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] uppercase text-left">
               Track your <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-gold">SADHANA</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-bold leading-relaxed max-w-2xl italic text-left">
               The simplest way to log your daily rounds, join community events, and stay consistent on your spiritual path.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
              <Button onClick={onLoginClick} className="w-full sm:w-auto px-12 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-premium-xl group">
                 <div className="flex items-center gap-3 group-hover:scale-105 transition-transform">
                    Start Your Vow <ArrowRight size={20} />
                 </div>
              </Button>
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>
                 <div className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-xl group-hover:bg-saffron group-hover:text-white transition-all">
                    <ChevronDown size={24} />
                 </div>
                 <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Learn More</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
             <div className="relative rounded-[4rem] overflow-hidden border-[12px] border-white shadow-premium-xl aspect-[10/12] lg:aspect-auto">
                <img src="/hero.png" alt="Folkvizag Mastery" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[3s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                   <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
                      <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center text-white shadow-lg"><Flame size={20} /></div>
                      <div>
                         <span className="block text-[10px] font-black text-white/60 uppercase tracking-widest">Active Seekers</span>
                         <span className="text-sm font-black text-white tracking-tight">1,200+ Pushing Streaks</span>
                      </div>
                   </div>
                </div>
             </div>
             {/* Floating Achievement */}
             <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-10 -right-10 hidden xl:flex items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-premium-xl border border-gray-50"
             >
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold"><Award size={28} /></div>
                <div>
                   <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Rank #1</span>
                   <span className="text-lg font-black text-gray-900 uppercase italic">Mastery Class</span>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-20 bg-gray-900 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative z-10">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 group-hover:scale-110 transition-transform shadow-xl">
                 {React.cloneElement(stat.icon, { size: 28 })}
              </div>
              <h3 className="text-5xl font-black text-white tracking-tighter tabular-nums">{stat.value}</h3>
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-20">
           <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic">The Experience</h2>
           <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto leading-relaxed">Everything you need to grow your spiritual discipline in one integrated dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <Card key={i} className="p-14 bg-white border-none shadow-premium-xl rounded-[4rem] group hover:bg-gray-900 transition-colors duration-500 hover:translate-y-[-10px]">
               <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-white/10 transition-colors shadow-xl">
                  {f.icon}
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight uppercase italic group-hover:text-white transition-colors">{f.title}</h3>
               <p className="text-lg font-bold text-gray-400 leading-relaxed group-hover:text-gray-400/80 transition-colors">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-32 bg-gray-900 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-white/5" />
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85]">
                 SIMPLE <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-gold">PROCESS</span>
              </h2>
              <p className="text-xl text-gray-500 font-bold max-w-md leading-relaxed">Joining Folkvizag is the first step toward a lifelong habit of spiritual excellence.</p>
              <Button onClick={onLoginClick} className="px-10 py-5 bg-white text-gray-900 font-black rounded-3xl uppercase tracking-widest text-[11px] shadow-2xl hover:bg-cream transition-all">
                 Join the Community
              </Button>
           </div>
           
           <div className="space-y-12">
              {steps.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 group"
                >
                   <span className="text-6xl font-black text-white/10 group-hover:text-saffron transition-colors leading-none tracking-tighter">{s.step}</span>
                   <div className="space-y-3 pt-2">
                      <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">{s.title}</h4>
                      <p className="text-gray-500 font-bold leading-relaxed max-w-sm">{s.desc}</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Final Call */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-transparent pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saffron/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-10">
           <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none uppercase">READY TO <br/>RISE?</h2>
           <p className="text-xl md:text-2xl text-gray-400 font-bold italic leading-relaxed">Join 1,200+ seekers who have claimed their mastery. <br/>Your streak starts today.</p>
           <Button onClick={onLoginClick} className="px-14 py-7 bg-gray-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-premium-xl hover:bg-black transition-all">
              Initialize My Vow
           </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-100 px-6 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white"><Heart size={16} /></div>
             <span className="text-lg font-black text-gray-900 tracking-tighter uppercase italic">Folkvizag</span>
          </div>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">&copy; 2026 Folkvizag. All Rights Reserved. Built for Spiritual Seekers.</p>
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-saffron cursor-pointer">Privacy</span>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-saffron cursor-pointer">Terms</span>
          </div>
      </footer>
    </div>
  );
};

export default Landing;
