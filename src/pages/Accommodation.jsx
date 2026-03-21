import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Calendar, Users, Info, Clock, CheckCircle2, Loader2, Send } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useFirestore } from '../hooks/useFirestore'
import { useAuth } from '../hooks/useAuth'
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp, where, query, orderBy, updateDoc, doc } from 'firebase/firestore'

const Accommodation = () => {
  const { user } = useAuth();
  const requestsQuery = React.useMemo(() => {
    if (user?.role === 'admin' || user?.role === 'folks_head') {
      return [orderBy('createdAt', 'desc')];
    }
    return [
      where('userId', '==', user?.uid || ''),
      orderBy('createdAt', 'desc')
    ];
  }, [user?.uid, user?.role]);

  const { data: requests, loading } = useFirestore('accommodation_requests', requestsQuery);

  const [formData, setFormData] = useState({
    type: 'Individual Guest House',
    guestCount: 1,
    arrivalDate: '',
    departureDate: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'accommodation_requests'), {
        ...formData,
        userId: user.uid,
        userName: user.name || user.displayName || 'Devotee',
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setFormData({
        type: 'Individual Guest House',
        guestCount: 1,
        arrivalDate: '',
        departureDate: '',
        requirements: ''
      });
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const requestRef = doc(db, 'accommodation_requests', requestId);
      await updateDoc(requestRef, { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      // Trigger notification placeholder
      console.log(`Notification: Accommodation Request ${requestId} ${newStatus}!`);
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100 border-green-200';
      case 'Rejected': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-saffron bg-saffron/10 border-saffron/20';
    }
  };

  if (loading && requests.length === 0) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-saffron" size={40} /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-saffron-dark underline decoration-gold/20">Accommodation</h1>
          <p className="text-gray-500 mt-1">Book your stay for upcoming festivals and holy visits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Form */}
        <Card className="lg:col-span-2 shadow-premium border-none p-8 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
             <Home size={120} className="text-gold" />
          </div>
          <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-gray-800">
            <div className="w-10 h-10 bg-saffron/10 rounded-xl flex items-center justify-center">
              <Home className="text-saffron" size={20} />
            </div>
            Request a Room
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Accommodation Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-cream/30 border border-saffron/10 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-saffron/40 transition-all font-medium appearance-none"
                >
                  <option>Individual Guest House</option>
                  <option>Dormitory Bed</option>
                  <option>Family Apartment</option>
                  <option>Volunteer Quarters</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Number of Guests</label>
                <div className="relative">
                   <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                    type="number" 
                    min={1}
                    value={formData.guestCount}
                    onChange={(e) => setFormData({...formData, guestCount: parseInt(e.target.value)})}
                    className="w-full pl-12 pr-4 py-3 bg-cream/30 border border-saffron/10 rounded-xl outline-none focus:bg-white focus:border-saffron/40 transition-all font-medium" 
                   />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 rotate-1">Arrival Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="date" 
                    value={formData.arrivalDate}
                    onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-cream/30 border border-saffron/10 rounded-xl outline-none focus:bg-white focus:border-saffron/40 transition-all font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 -rotate-1">Departure Date</label>
                 <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="date" 
                    value={formData.departureDate}
                    onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-cream/30 border border-saffron/10 rounded-xl outline-none focus:bg-white focus:border-saffron/40 transition-all font-medium" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Special Requirements / Purpose</label>
              <textarea 
                rows={4} 
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                placeholder="E.g. Ground floor preferred, coming for Janmashtami Seva..." 
                className="w-full bg-cream/30 border border-saffron/10 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-saffron/40 transition-all font-medium resize-none shadow-inner" 
              />
            </div>

            <Button 
              disabled={isSubmitting}
              className="w-full py-4 text-lg bg-gradient-to-r from-saffron to-gold shadow-lg hover:shadow-xl transition-all font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </form>
        </Card>

        {/* Sidebar Info & Recent */}
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-saffron/5 to-gold/5 border-saffron/10 p-6 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-saffron-dark">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                 <Info size={16} className="text-saffron" />
              </div>
              Stay Guidelines
            </h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-3">
                 <span className="w-1.5 h-1.5 bg-saffron rounded-full mt-1.5 shrink-0" />
                 <span>Check-in after <strong>12:00 PM</strong></span>
              </li>
              <li className="flex gap-3">
                 <span className="w-1.5 h-1.5 bg-saffron rounded-full mt-1.5 shrink-0" />
                 <span>Check-out before <strong>10:00 AM</strong></span>
              </li>
              <li className="flex gap-3">
                 <span className="w-1.5 h-1.5 bg-saffron rounded-full mt-1.5 shrink-0" />
                 <span>Simple Satvik Prasadam is provided at set times.</span>
              </li>
              <li className="flex gap-3">
                 <span className="w-1.5 h-1.5 bg-saffron rounded-full mt-1.5 shrink-0" />
                 <span className="italic">Maintain spiritual decorum and silence during night hours.</span>
              </li>
            </ul>
          </Card>

          <section>
            <div className="flex justify-between items-center mb-5 px-2">
               <h3 className="font-bold text-gray-800">
                 {user?.role === 'devotee' ? 'Your Recent Activity' : 'Incoming Requests'}
               </h3>
               <span className="text-[10px] font-bold text-saffron uppercase">View All</span>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
              <AnimatePresence mode='popLayout'>
                {requests.length > 0 ? requests.map((req) => (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="group"
                  >
                    <Card className="p-5 border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-300 font-mono tracking-tighter uppercase">{req.userName || 'Devotee'}</span>
                          <span className="text-[8px] text-gray-400 font-mono tracking-tighter">REQ_{req.id.slice(0,6).toUpperCase()}</span>
                        </div>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 group-hover:text-saffron transition-colors text-sm">{req.type}</h4>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                         <Calendar size={12} className="text-gold" />
                         <span>{req.arrivalDate} to {req.departureDate}</span>
                      </div>
                      
                      {user?.role !== 'devotee' && req.status === 'Pending' && (
                        <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(req.id, 'Approved')}
                            className="flex-1 py-2 bg-green-500 text-white text-[10px] font-bold rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                            className="flex-1 py-2 bg-red-50 text-red-500 text-[10px] font-bold rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )) : (
                  <div className="p-10 text-center text-gray-300 italic text-sm">No requests found.</div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>

      <Card className="p-6 sm:p-10 border-none shadow-premium bg-gradient-to-r from-white to-cream/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-10 pointer-events-none" />
        <h2 className="text-xl font-bold mb-8 sm:mb-10 text-center text-gray-800">Reservation Lifecycle</h2>
        <div className="relative flex flex-col md:flex-row justify-between items-center max-w-3xl mx-auto gap-8 md:gap-0 md:px-10">
          <div className="hidden md:block absolute top-[28px] left-[50px] right-[50px] h-0.5 bg-gray-100 -z-0" />
          {[
            { label: 'Submitted', done: true, icon: <Clock /> },
            { label: 'Reviewing', done: false, icon: <Users /> },
            { label: 'Assigned', done: false, icon: <Home /> },
            { label: 'Check-in', done: false, icon: <CheckCircle2 /> },
          ].map((step, i) => (
            <div key={i} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shrink-0 ${
                step.done 
                  ? 'bg-saffron border-saffron shadow-lg shadow-saffron/20 text-white' 
                  : 'bg-white border-gray-100 text-gray-300'
              }`}>
                {React.cloneElement(step.icon, { size: 24 })}
              </div>
              <div className="flex flex-col md:items-center">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.done ? 'text-saffron-dark' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                <span className="text-[9px] text-gray-400 md:hidden font-medium">Pending verification</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

export default Accommodation
