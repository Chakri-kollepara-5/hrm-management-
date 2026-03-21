import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { auth, db } from '../lib/firebase'
import { 
  Calendar, MapPin, Tag, Users, ArrowRight, Loader2, Plus, X, Clock, Image as ImageIcon, CheckCircle2, XCircle
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useFirestore } from '../hooks/useFirestore'
import { collection, addDoc, serverTimestamp, setDoc, doc, where, updateDoc, increment } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

const Events = () => {
  const { user } = useAuth();
  const { data: firestoreEvents, loading: eventsLoading } = useFirestore('events');
  
  const regQuery = React.useMemo(() => [where('userId', '==', user?.uid || 'guest')], [user?.uid]);
  const { data: registrations } = useFirestore('registrations', regQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  
  useEffect(() => {
    if (window.location.hash === '#new') {
      setIsModalOpen(true);
      window.location.hash = ''; // Clear it out so it doesn't infinite loop on refresh
    }
  }, []);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: 'Retreats',
    description: '',
    img: 'https://picsum.photos/seed/temple/800/400',
    attendees: '0'
  });

  const categories = ['All', 'Retreats', 'Kirtans', 'Yatras', 'Seminars', 'Other']
  
  const mockEvents = [
    {
      id: 'mock1',
      title: 'Vrindavan Kartik Yatra 2026',
      date: 'Oct 20 - Nov 19, 2026',
      location: 'Vrindavan, UP',
      category: 'Yatra',
      attendees: '450+',
      img: 'https://picsum.photos/seed/yatra/800/400',
      description: 'A spiritual journey to the holy land of Vrindavan during the auspicious month of Kartik.'
    },
    {
      id: 'mock2',
      title: 'Maha Abhishek Festival',
      date: 'August 15, 2026',
      location: 'Main Temple Hall',
      category: 'Other',
      attendees: '1200+',
      img: 'https://picsum.photos/seed/festival/800/400',
      description: 'Grand bathing ceremony of their Lordships with sacred substances and ecstatic kirtan.'
    }
  ]

  const events = (firestoreEvents && firestoreEvents.length > 0) ? firestoreEvents : mockEvents;
  
  const filteredEvents = activeCategory === 'All' 
    ? events 
    : events.filter(e => e.category === activeCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rawDate = new Date(formData.date);
      const formattedDate = rawDate.toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
      });

      const eventRef = await addDoc(collection(db, 'events'), {
        ...formData,
        date: formattedDate,
        groupId: auth.currentUser?.uid || 'system',
        createdAt: serverTimestamp()
      });
      
      // Broadcast system-wide notification
      await addDoc(collection(db, 'notifications'), {
        type: 'new_event',
        title: `New Event: ${formData.title}`,
        message: `Join our upcoming ${formData.category} at ${formData.location} on ${formattedDate}.`,
        link: '/events',
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid || 'system'
      });
      
      setIsModalOpen(false);
      setFormData({
        title: '',
        date: '',
        location: '',
        category: 'Retreats',
        description: '',
        img: 'https://picsum.photos/seed/temple/800/400',
        attendees: '0'
      });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to create event: " + error.message);
    }
  };

  const handleRSVP = async (event, isAttending) => {
    if (!user) return;
    try {
      const token = isAttending ? uuidv4().slice(0, 8).toUpperCase() : null;
      const status = isAttending ? 'Attending' : 'Not Attending';
      const registrationRef = doc(db, 'registrations', `${event.id}_${user.uid}`);
      
      const prevState = registrations?.find(r => r.eventId === event.id)?.status;
      if (prevState === status) return;
      
      let attendingDiff = 0;
      let declinedDiff = 0;
      
      if (isAttending) {
         attendingDiff = 1;
         if (prevState === 'Not Attending') declinedDiff = -1;
      } else {
         declinedDiff = 1;
         if (prevState === 'Attending') attendingDiff = -1;
      }
      
      const eventRef = doc(db, 'events', event.id);
      
      await updateDoc(eventRef, {
        attendingCount: increment(attendingDiff),
        declinedCount: increment(declinedDiff)
      });
      
      await setDoc(registrationRef, {
        eventId: event.id,
        eventTitle: event.title,
        userId: user.uid,
        userName: user.name || auth.currentUser?.displayName || 'Devotee',
        token: token,
        status: status,
        updatedAt: serverTimestamp()
      }, { merge: true });
      if (isAttending) {
        alert(`Successfully registered! Your Attendance Token: ${token}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to RSVP: " + error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > 800) {
           height = Math.round((height * 800) / width);
           width = 800;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFormData({...formData, img: dataUrl});
      }
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  if (eventsLoading && firestoreEvents.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-saffron" size={40} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-saffron-dark">Event Management</h1>
          <p className="text-gray-500 mt-1">Discover and join upcoming spiritual gatherings</p>
        </div>
        {user?.role && (user.role === 'admin' || user.role === 'folks_head') && (
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-saffron to-gold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            <span>Create Event</span>
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium ${
              cat === activeCategory 
                ? 'bg-saffron text-white shadow-lg scale-105' 
                : 'bg-white border border-saffron/10 text-gray-500 hover:border-saffron/30 hover:text-saffron'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Event Card (Top one) */}
      {filteredEvents.length > 0 && (
        <Card className="relative overflow-hidden p-0 group border-none shadow-premium transition-all duration-500 hover:shadow-premium-xl" hover={false}>
          <div className="aspect-[16/10] sm:aspect-[21/9] md:aspect-[25/9] overflow-hidden">
            <img 
              src={filteredEvents[0].img} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt={filteredEvents[0].title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-10 text-white w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-saffron/90 backdrop-blur-sm px-3 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg">Featured</span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest">{filteredEvents[0].category}</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-5xl font-bold mb-3 font-poppins line-clamp-2">{filteredEvents[0].title}</h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm md:text-base text-gray-200">
              <span className="flex items-center gap-1.5 font-medium"><Calendar size={18} className="text-gold" /> {filteredEvents[0].date}</span>
              <span className="hidden sm:flex items-center gap-1.5 font-medium"><MapPin size={18} className="text-gold" /> {filteredEvents[0].location}</span>
            </div>
            <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {(() => {
                const reg = registrations?.find(r => r.eventId === filteredEvents[0].id);
                if (reg?.status === 'Attending') {
                  return (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                      <CheckCircle2 className="text-green-400" size={24} />
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-wider">Attending</p>
                        <p className="text-[10px] text-green-300 font-medium">Token: {reg.token}</p>
                      </div>
                      <Button onClick={() => handleRSVP(filteredEvents[0], false)} variant="secondary" className="ml-4 bg-red-500/20 text-red-100 hover:bg-red-500/40 border-none px-3 py-1 text-xs">Cancel</Button>
                    </div>
                  );
                } else if (reg?.status === 'Not Attending') {
                  return (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                      <XCircle className="text-red-400" size={24} />
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Not Attending</p>
                      <Button onClick={() => handleRSVP(filteredEvents[0], true)} className="ml-4 bg-white text-saffron hover:bg-cream border-none px-4 py-1.5 font-bold rounded-lg text-xs">Join Anyway</Button>
                    </div>
                  );
                }
                return (
                  <div className="flex gap-3">
                    <Button onClick={() => handleRSVP(filteredEvents[0], true)} className="bg-white text-saffron hover:bg-cream border-none px-6 py-3 shadow-2xl font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={18} /> I will Attend
                    </Button>
                    <Button onClick={() => handleRSVP(filteredEvents[0], false)} variant="secondary" className="bg-black/20 text-white hover:bg-black/40 border-white/10 px-6 py-3 shadow-2xl font-bold rounded-xl flex items-center gap-2">
                      <XCircle size={18} /> Can't Make It
                    </Button>
                  </div>
                );
              })()}
            </div>
          </div>
        </Card>
      )}

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {filteredEvents.slice(1).map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-0 overflow-hidden flex flex-col h-full border-none shadow-md hover:shadow-premium group">
              <div className="h-52 overflow-hidden relative">
                <img src={event.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={event.title} />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold text-saffron uppercase tracking-widest shadow-md border border-saffron/10">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gold">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">
                      <Users size={12} /> {event.attendingCount || 0}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded-md truncate max-w-[50px]">
                      {event.declinedCount || 0}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-1 group-hover:text-saffron transition-colors">{event.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">{event.description}</p>
                
                <div className="mt-auto border-t border-gray-100 pt-3">
                  {(() => {
                    const reg = registrations?.find(r => r.eventId === event.id);
                    if (reg?.status === 'Attending') {
                      return (
                        <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" size={16} />
                            <span className="text-xs font-bold text-green-700">Attending</span>
                          </div>
                          <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-green-600 shadow-sm border border-green-50">{reg.token}</span>
                        </div>
                      );
                    } else if (reg?.status === 'Not Attending') {
                      return (
                        <div className="flex items-center justify-between bg-red-50 px-3 py-2 rounded-lg border border-red-50">
                          <div className="flex items-center gap-2">
                            <XCircle className="text-red-400" size={16} />
                            <span className="text-xs font-bold text-red-500">Not Attending</span>
                          </div>
                          <button onClick={() => handleRSVP(event, true)} className="text-[10px] font-bold text-saffron hover:underline">Change</button>
                        </div>
                      );
                    }
                    return (
                      <div className="flex gap-2">
                        <Button onClick={() => handleRSVP(event, true)} className="flex-1 py-1.5 text-[11px] font-bold bg-saffron text-white rounded-lg shadow-sm flex items-center justify-center gap-1"><CheckCircle2 size={12}/> Attend</Button>
                        <Button onClick={() => handleRSVP(event, false)} variant="secondary" className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold bg-gray-50 text-gray-500 border-gray-200 rounded-lg hover:bg-gray-100"><XCircle size={12}/> Decline</Button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-premium p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-saffron-dark mb-6">Create New Event</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Event Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-saffron outline-none transition-all font-medium"
                      placeholder="e.g. Maha Kirtan Night"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-saffron outline-none transition-all appearance-none font-medium"
                    >
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Date & Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="datetime-local" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-saffron outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-saffron outline-none transition-all font-medium"
                        placeholder="e.g. Temple Hall"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-saffron outline-none transition-all font-medium resize-none"
                    placeholder="Short description of the event..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Event Banner Image</label>
                  <label className="flex items-center gap-3 cursor-pointer w-full px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-100 hover:border-saffron/30 transition-all font-medium overflow-hidden">
                    <ImageIcon className={formData.img.startsWith('data:image') ? "text-saffron" : "text-gray-400"} size={20} />
                    <span className="text-sm font-medium text-gray-500 truncate">
                      {formData.img.startsWith('data:image') ? "Image captured and compressed!" : "Click to select image file..."}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.img && formData.img.startsWith('data:image') && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 h-32 w-full rounded-xl overflow-hidden shadow-sm relative group">
                       <img src={formData.img} alt="Preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white font-bold text-xs uppercase tracking-widest px-3 py-1 bg-black/50 rounded flex items-center gap-1"><CheckCircle2 size={14}/> Ready</span>
                       </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 font-bold border-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 py-4 font-bold bg-gradient-to-r from-saffron to-gold shadow-lg"
                  >
                    Publish Event
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Events
