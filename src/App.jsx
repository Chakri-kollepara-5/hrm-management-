import React, { useState, useEffect } from 'react'
import MainLayout from './components/layout/MainLayout'
import AdminDashboard from './pages/AdminDashboard'
import Events from './pages/Events'
import SadhanaTracker from './pages/SadhanaTracker'
import Accommodation from './pages/Accommodation'
import Attendance from './pages/Attendance'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Splash from './components/Splash'
import Devotees from './pages/Devotees'
import SevaDashboard from './pages/SevaDashboard'
import { useAuth } from './hooks/useAuth'
import UserRoleGuard from './components/auth/UserRoleGuard'

function App() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem('fast_load_cache');
  });
  const [showLanding, setShowLanding] = useState(() => {
    return !localStorage.getItem('fast_load_cache');
  });
  const [attendanceOptions, setAttendanceOptions] = useState({ autoScan: false });

  useEffect(() => {
    if (user) {
      if (user.role === 'folks_head' || user.role === 'admin') {
        setActiveTab('admin')
      } else {
        setActiveTab('dashboard')
      }
    }
  }, [user]);

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true')
    setShowSplash(false)
  }

  if (showSplash) {
    return <Splash onComplete={handleSplashComplete} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    if (showLanding) {
      return <Landing onLoginClick={() => setShowLanding(false)} />
    }
    return <Login />
  }

  if (user.requiresRole) {
    return <Login />
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'devotees': 
        return <UserRoleGuard allowedRoles={['admin', 'folks_head']}><Devotees /></UserRoleGuard>
      case 'events': 
        return <Events />
      case 'dashboard': 
        return <SadhanaTracker />
      case 'accommodation': 
        return <Accommodation />
      case 'attendance': 
        return (
          <UserRoleGuard allowedRoles={['admin', 'folks_head']}>
            <Attendance 
              autoScan={attendanceOptions.autoScan} 
              onScanStarted={() => setAttendanceOptions({ autoScan: false })} 
            />
          </UserRoleGuard>
        )
      case 'seva':
        return <SevaDashboard />
      case 'admin':
        return (
          <UserRoleGuard allowedRoles={['admin', 'folks_head']}>
            <AdminDashboard 
              setActiveTab={setActiveTab} 
              setAttendanceOptions={setAttendanceOptions}
            />
          </UserRoleGuard>
        )
      default: 
        return (
          <UserRoleGuard allowedRoles={['admin', 'folks_head']}>
            <AdminDashboard 
              setActiveTab={setActiveTab} 
              setAttendanceOptions={setAttendanceOptions}
            />
          </UserRoleGuard>
        )
    }
  }

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MainLayout>
  )
}

export default App
