import React, { useState, useRef, useEffect } from 'react'
import { LogOut, User, Bell, Award, Shield, Calendar } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useFirestore } from '../../hooks/useFirestore'
import { orderBy, limit } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = ({ setActiveTab }) => {
  const { user, logout } = useAuth()
  const [showNotifs, setShowNotifs] = useState(false)
  const notifRef = useRef(null)

  const notifQuery = React.useMemo(() => [
    orderBy('createdAt', 'desc'),
    limit(10)
  ], [])
  
  const { data: notifications } = useFirestore('notifications', notifQuery)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-20 bg-white/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between border-b border-saffron/10 transition-all duration-500">
      <div className="flex items-center gap-4">
        <div className="flex items-center drop-shadow-sm hover:drop-shadow-md transition-all duration-300">
          <img 
            src="/logo.png" 
            alt="Folkvizag Logo" 
            className="h-12 w-auto object-contain hover:scale-[1.02] transition-transform cursor-pointer filter sepia saturate-[6] hue-rotate-[-30deg] drop-shadow-[0_0_8px_rgba(255,153,51,0.2)]" 
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 sm:gap-6">
          
          {/* Realtime Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2.5 text-gray-400 hover:text-saffron hover:bg-saffron/5 rounded-xl transition-all relative group"
            >
              <Bell size={22} className={showNotifs ? 'text-saffron' : ''} />
              {notifications?.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform animate-pulse" />
              )}
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-premium-xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                >
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Notifications</h3>
                    <span className="text-[10px] font-bold bg-saffron/10 text-saffron px-2 py-1 rounded-md">{notifications?.length || 0} New</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                    {notifications?.length > 0 ? notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => { setActiveTab('events'); setShowNotifs(false); }}
                        className="p-4 border-b border-gray-50 hover:bg-saffron/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <Calendar size={14} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 group-hover:text-saffron transition-colors">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 mt-2 font-medium">Just now</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                    )}
                  </div>
                  <div className="p-3 text-center border-t border-gray-50 bg-gray-50/50 hover:bg-gray-100 cursor-pointer transition-colors text-xs font-bold text-saffron">
                    View All Activity
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-10 w-[1px] bg-gray-100 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5 mb-0.5">
                <p className="text-sm font-bold text-gray-800 leading-none max-w-[150px] truncate">
                  {user?.name || user?.displayName || 'Devotee'}
                </p>
                {user?.role === 'admin' && (
                  <div className="px-2 py-0.5 bg-saffron/10 rounded flex items-center gap-1">
                    <Shield size={10} className="text-saffron" />
                    <span className="text-[10px] font-black text-saffron uppercase">Admin</span>
                  </div>
                )}
              </div>
              {user?.role === 'folks_head' && (
                <p className="text-[10px] text-gold-dark font-bold uppercase tracking-widest">Folks Head</p>
              )}
              {user?.role === 'devotee' && (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Devotee</p>
              )}
              {!user?.role && (
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Unassigned</p>
              )}
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-saffron to-gold p-0.5 shadow-lg group cursor-pointer">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                <User className="text-saffron transition-transform group-hover:scale-110" size={20} />
              </div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
