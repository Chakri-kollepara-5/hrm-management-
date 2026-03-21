import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, TrendingUp, Calendar, Zap, Loader2, Plus, CheckCircle2, Circle } from 'lucide-react'
import Card from '../components/ui/Card'
import CircularProgress from '../components/sadhana/CircularProgress'
import TaskItem from '../components/sadhana/TaskItem'
import Button from '../components/ui/Button'
import { useFirestore } from '../hooks/useFirestore'
import { useAuth } from '../hooks/useAuth'
import { db } from '../lib/firebase'
import { doc, updateDoc, setDoc, getDoc, serverTimestamp, collection, query, where, limit } from 'firebase/firestore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const SadhanaTracker = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const sadhanaQuery = React.useMemo(() => [
    where('userId', '==', user?.uid || ''),
    limit(7)
  ], [user?.uid]);

  const { data: firestoreData, loading } = useFirestore('sadhana_logs', sadhanaQuery);

  const [rounds, setRounds] = useState(0);
  const [tasks, setTasks] = useState([
    { id: 'japa', label: 'Morning Japa (16 rounds)', done: false },
    { id: 'reading', label: 'Bhagavad Gita Reading', done: false },
    { id: 'aarti_m', label: 'Morning Aarti', done: false },
    { id: 'aarti_e', label: 'Evening Aarti', done: false },
    { id: 'sewa', label: 'Vaishnava Sewa', done: false },
  ]);

  useEffect(() => {
    if (user && !loading) {
      const todayLog = firestoreData.find(log => log.date === today);
      if (todayLog) {
        setRounds(todayLog.rounds || 0);
        if (todayLog.tasks) {
          setTasks(prev => prev.map(t => ({ ...t, done: !!todayLog.tasks[t.id] })));
        }
      }
    }
  }, [firestoreData, user, loading, today]);

  const handleUpdateRounds = async () => {
    const newRounds = prompt("How many rounds did you complete today?", rounds);
    if (newRounds !== null) {
      const val = parseInt(newRounds);
      if (!isNaN(val)) {
        await saveToFirestore({ rounds: val });
        setRounds(val);
      }
    }
  };

  const toggleTask = async (taskId) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
    setTasks(newTasks);
    
    const taskObj = {};
    newTasks.forEach(t => taskObj[t.id] = t.done);
    
    // Calculate score
    const score = Math.round((rounds / 16) * 60 + (newTasks.filter(t => t.done).length / newTasks.length) * 40);
    const progress = Math.min(100, Math.round((rounds / 16) * 100));
    await saveToFirestore({ tasks: taskObj, score, progress });
  };

  const saveToFirestore = async (updates) => {
    if (!user) return;
    const logId = `${user.uid}_${today}`;
    const logRef = doc(db, 'sadhana_logs', logId);
    
    // Auto-calculate score if not provided but rounds or tasks are
    const currentRounds = updates.rounds !== undefined ? updates.rounds : rounds;
    const currentTasks = updates.tasks !== undefined ? updates.tasks : tasks.reduce((acc, t) => ({ ...acc, [t.id]: t.done }), {});
    
    const taskCount = Array.isArray(tasks) ? tasks.length : 5;
    const doneTasks = Object.values(currentTasks).filter(v => v === true).length;
    const score = updates.score !== undefined ? updates.score : Math.round((currentRounds / 16) * 60 + (doneTasks / taskCount) * 40);
    
    try {
      const snap = await getDoc(logRef);
      const dataToSave = { 
        ...updates, 
        score: score,
        updatedAt: serverTimestamp() 
      };

      if (snap.exists()) {
        await updateDoc(logRef, dataToSave);
      } else {
        await setDoc(logRef, {
          userId: user.uid,
          userName: user.name || user.displayName || 'Devotee',
          date: today,
          rounds: currentRounds,
          tasks: currentTasks,
          score: score,
          createdAt: serverTimestamp(),
          ...updates
        });
      }
    } catch (error) {
      console.error("Error saving sadhana:", error);
    }
  };

  const chartData = [
    { day: 'Mon', rounds: 16 },
    { day: 'Tue', rounds: 14 },
    { day: 'Wed', rounds: 16 },
    { day: 'Thu', rounds: 16 },
    { day: 'Fri', rounds: 8 },
    { day: 'Sat', rounds: 12 },
    { day: 'Sun', rounds: 16 },
  ];

  if (loading && firestoreData.length === 0) {
     return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-saffron" size={40} /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-saffron-dark underline decoration-gold/30">Sadhana Tracker</h1>
          <p className="text-gray-500 mt-1">Consistency is the key to spiritual growth. Tracking your journey.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-saffron/10 shadow-premium">
          <div className="w-10 h-10 bg-saffron/20 rounded-xl flex items-center justify-center">
             <Flame className="text-saffron animate-pulse" fill="#FF9933" size={24} />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Streak Counter</span>
            <span className="text-xl font-bold text-saffron-dark">12 Days</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Overview */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center p-10 bg-gradient-to-br from-white via-white to-saffron/5 border-none shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <TrendingUp size={20} className="text-gold/30" />
          </div>
          <CircularProgress current={rounds} total={16} label="Daily Rounds" />
          <div className="mt-10 grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-4 rounded-2xl bg-cream/30 border border-saffron/5">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Target</p>
              <p className="text-2xl font-bold text-saffron">16</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-cream/30 border border-saffron/5">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Completed</p>
              <p className="text-2xl font-bold text-gold-dark">{rounds}</p>
            </div>
            <div className="col-span-2 text-center p-4 rounded-2xl bg-saffron/10 border border-saffron/20 mt-2">
              <p className="text-[10px] text-saffron font-black uppercase tracking-[0.2em] mb-1">Sadhana Score</p>
              <p className="text-3xl font-black text-saffron-dark">
                {Math.round((rounds / 16) * 60 + (tasks.filter(t => t.done).length / tasks.length) * 40)}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleUpdateRounds}
            className="w-full mt-8 py-4 text-lg bg-gradient-to-r from-saffron to-gold shadow-lg hover:shadow-xl transition-all font-bold"
          >
            Update Rounds
          </Button>
        </Card>

        {/* Weekly Analysis */}
        <Card className="lg:col-span-2 shadow-premium border-none">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-saffron" /> Weekly Rounds Analysis
            </h2>
            <select className="bg-cream/30 border border-saffron/10 rounded-xl px-4 py-2 text-sm outline-none font-medium text-gray-600 focus:border-saffron/40 transition-all">
              <option>Current Week</option>
              <option>Previous Week</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#FF993308' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Bar dataKey="rounds" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rounds >= 16 ? '#FF9933' : '#FFD700'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
               <Zap className="text-blue-500" size={20} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-blue-700">Insight:</strong> Your spiritual intensity is highest on Mondays and Sundays. Keep up the morning consistency to hit your 16-round goal every day!
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Checklist */}
        <Card className="shadow-premium border-none p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">Spiritual Checklist</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tasks.filter(t => t.done).length} / {tasks.length} Done</span>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div 
                key={task.id}
                whileActive={{ scale: 0.98 }}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                  task.done 
                    ? 'bg-green-50 border-green-100 text-green-800' 
                    : 'bg-white border-gray-100 text-gray-600 hover:border-saffron/30 hover:bg-saffron/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`transition-colors ${task.done ? 'text-green-500' : 'text-gray-300 group-hover:text-saffron'}`}>
                    {task.done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <span className={`font-semibold ${task.done ? 'line-through opacity-60' : ''}`}>{task.label}</span>
                </div>
                {task.done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[10px] font-bold uppercase tracking-wider bg-green-200/50 px-2 py-0.5 rounded-md">Saved</motion.div>}
              </motion.div>
            ))}
          </div>
          <Button variant="secondary" className="w-full mt-8 py-3 border-gray-200 text-gray-500 hover:text-saffron hover:border-saffron/20 hover:bg-saffron/5 transition-all flex items-center justify-center gap-2">
            <Plus size={18} />
            Add Custom Activity
          </Button>
        </Card>

        {/* Milestone Card */}
        <Card className="bg-gradient-to-br from-gold/10 to-saffron/10 border-none shadow-premium p-8 relative overflow-hidden">
          <div className="tilak-bg opacity-5 absolute inset-0 pointer-events-none" />
          <h2 className="text-xl font-bold text-gray-800 mb-8 relative z-10">Current Milestone</h2>
          <div className="flex flex-col items-center text-center relative z-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32 rounded-full border-4 border-dashed border-gold/30 flex items-center justify-center mb-6"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-saffron to-gold flex items-center justify-center text-white text-5xl shadow-2xl relative">
                ✨
                <div className="absolute -top-2 -right-2 bg-white text-gold rounded-full p-1 shadow-lg ring-4 ring-gold/10">
                  <Flame size={16} fill="currentColor" />
                </div>
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-saffron-dark font-poppins">Pilgrim Path</h3>
            <p className="text-gray-500 mt-2 text-sm max-w-[280px] leading-relaxed">
              "Dedicated practice reveals deeper wisdom. You're 23 rounds away from the next level!"
            </p>
            
            <div className="mt-10 w-full">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
                <span>Practitioner</span>
                <span className="text-saffron">75% Complete</span>
                <span>Steadfast</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3.5 p-1 overflow-hidden backdrop-blur-sm border border-white/50 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-gold via-saffron to-gold rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
            
            <button className="mt-8 text-saffron-dark text-xs font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
              View All Milestones
            </button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default SadhanaTracker
