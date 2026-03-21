import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Clock, 
  MapPin, 
  Users, 
  QrCode,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Ticket
} from 'lucide-react'
import { db } from '../lib/firebase'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import Card from '../components/ui/Card'
import { useFirestore } from '../hooks/useFirestore'
import { useAuth } from '../hooks/useAuth'

const Attendance = () => {
  const { user } = useAuth();
  const attendanceQuery = React.useMemo(() => [], []);
  const { data: checkins, loading } = useFirestore('attendance', attendanceQuery);
  const [searchTerm, setSearchTerm] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const { data: myRegistrations } = useFirestore('registrations', React.useMemo(() => [
    where('userId', '==', user?.uid || '')
  ], [user?.uid]));

  const filteredCheckins = checkins.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.session?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (!tokenInput) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const q = query(collection(db, 'registrations'), where('token', '==', tokenInput.toUpperCase()));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const regData = snap.docs[0].data();
        // Check if already checked in
        const checkinQ = query(collection(db, 'attendance'), 
          where('userId', '==', regData.userId),
          where('eventId', '==', regData.eventId)
        );
        const checkinSnap = await getDocs(checkinQ);
        
        if (!checkinSnap.empty) {
          setVerifyResult({ success: false, message: 'Already checked in!' });
        } else {
          // Record check-in
          await addDoc(collection(db, 'attendance'), {
            userId: regData.userId,
            name: regData.userName,
            eventId: regData.eventId,
            session: regData.eventTitle,
            status: 'On-time',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: serverTimestamp()
          });
          setVerifyResult({ success: true, message: `Verified: ${regData.userName}` });
          setTokenInput('');
        }
      } else {
        setVerifyResult({ success: false, message: 'Invalid Token' });
      }
    } catch (error) {
      console.error("Verification error:", error);
      const msg = error.code === 'permission-denied' 
        ? 'Permission Denied: Admin access required for verification.' 
        : 'Error verifying token. Please check your connection.';
      setVerifyResult({ success: false, message: msg });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-saffron-dark">Live Attendance</h1>
          <p className="text-sm text-gray-500">Real-time devotee check-ins and session tracking</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 shadow-sm hover:shadow-md transition-all">
             <Filter size={16} />
             <span>Filter</span>
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-saffron to-gold text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all">
             <QrCode size={16} />
             <span>Scan QR</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tracker Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-premium bg-white p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-gray-800">Recent Check-ins</h2>
              <div className="relative flex-1 md:max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search check-ins..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-saffron focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="-mx-6 sm:mx-0 overflow-x-auto pb-4 scrollbar-hide">
              <div className="min-w-[600px] sm:min-w-full px-6 sm:px-0">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                      <th className="px-6 py-4 font-black">Devotee</th>
                      <th className="px-6 py-4 font-black">Session</th>
                      <th className="px-6 py-4 font-black">Time</th>
                      <th className="px-6 py-4 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredCheckins.length > 0 ? filteredCheckins.map((row, i) => (
                      <tr key={i} className="hover:bg-saffron/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-[10px] font-bold text-saffron-dark border border-saffron/10 group-hover:bg-white">
                              {row.name?.charAt(0)}
                            </div>
                            <span className="font-bold text-gray-700">{row.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">{row.session}</td>
                        <td className="px-6 py-4 flex items-center gap-2 text-gray-400">
                           <Clock size={14} className="text-gold" />
                           {row.time || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            row.status === 'On-time' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-20 text-center text-gray-400 font-medium italic">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                               <Search size={24} />
                            </div>
                            <span>No check-ins found for "{searchTerm}".</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* Admin/User Specific Views */}
        <div className="space-y-6">
          {user?.role !== 'devotee' ? (
            <Card className="p-8 border-none shadow-premium bg-white">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <QrCode size={18} className="text-saffron" />
                Verify Devotee Token
              </h3>
              <form onSubmit={handleVerifyToken} className="space-y-4">
                <div className="relative">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter 8-digit token..."
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-saffron focus:bg-white transition-all font-mono font-bold uppercase tracking-widest text-lg"
                  />
                </div>
                <button 
                  disabled={verifying}
                  className="w-full py-4 bg-saffron text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {verifying ? 'Checking...' : 'Check-in Devotee'}
                </button>
              </form>
              
              <AnimatePresence>
                {verifyResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`mt-4 p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${
                      verifyResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {verifyResult.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {verifyResult.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ) : (
            <Card className="p-8 bg-gradient-to-br from-saffron to-gold text-white border-none shadow-premium overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Ticket size={24} /> My Registrations
              </h3>
              <p className="text-white/80 text-sm mb-6">Your unique tokens for upcoming events</p>
              
              <div className="space-y-4 relative z-10">
                {myRegistrations.length > 0 ? myRegistrations.map((reg) => (
                  <div key={reg.id} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">{reg.eventTitle}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-mono font-black tracking-tighter">{reg.token}</span>
                      <QrCode size={20} className="text-white/40" />
                    </div>
                  </div>
                )) : (
                  <p className="text-sm italic opacity-60">No active registrations.</p>
                )}
              </div>
            </Card>
          )}

          <Card className="p-6 border-none shadow-premium bg-white">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-saffron" />
              Quick Stats
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-500 font-medium">Total Present</span>
                  <span className="font-bold text-saffron-dark">{checkins.length}</span>
               </div>
               <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-500 font-medium">On-time Rate</span>
                  <span className="font-bold text-green-600">92%</span>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default Attendance
