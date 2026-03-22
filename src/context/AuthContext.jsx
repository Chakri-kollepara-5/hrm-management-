import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getSafeProfileImage } from '../lib/imageUtils';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('fast_load_cache');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(() => !localStorage.getItem('fast_load_cache'));
  const [profileLoaded, setProfileLoaded] = useState(() => !!localStorage.getItem('fast_load_cache'));

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      throw error;
    }
  };

  const loginEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      console.error("Firebase Login Error Details:", {
        code: error.code,
        message: error.message,
        customData: error.customData,
        email: email ? email.substring(0, 3) + '...' : 'none'
      });
      throw error;
    }
  };

  const registerEmail = async (email, password, name) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const setupRecaptcha = (containerId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible'
      });
    }
  };

  const sendOTP = async (phoneNumber) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      return confirmationResult;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (otp) => {
    try {
      await window.confirmationResult.confirm(otp);
    } catch (error) {
      throw error;
    }
  };

  const completeProfile = async (role, providedName) => {
    if (!auth.currentUser) return;
    
    // Supreme Admin Escalation Check
    const isRootAdmin = auth.currentUser.uid === 'wRbvUaFiBOYeXEEtF8OuXnzGWXs2';
    const assignedRole = isRootAdmin ? 'admin' : role;
    
    const userRef = doc(db, 'users', auth.currentUser.uid);
    try {
      const finalName = providedName || auth.currentUser.displayName || 'Devotee';
      const qrToken = crypto.randomUUID();
      
      const profileData = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email || '',
        name: finalName,
        photo: getSafeProfileImage(auth.currentUser.photoURL, auth.currentUser.displayName),
        role: assignedRole, 
        qrToken,
        createdAt: serverTimestamp()
      };
      await setDoc(userRef, profileData);
      
      if (providedName && !auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: finalName });
      }
      
      const finalUser = { ...auth.currentUser, ...profileData };
      setUser(finalUser);
      localStorage.setItem('fast_load_cache', JSON.stringify(finalUser));
    } catch (error) {
      console.error("Error completing profile:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('fast_load_cache');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            let liveRole = userData.role;
            
            // Auto-generate qrToken if missing
            if (!userData.qrToken) {
              const newToken = crypto.randomUUID();
              await setDoc(doc(db, 'users', authUser.uid), { qrToken: newToken }, { merge: true });
              userData.qrToken = newToken;
            }

            if (authUser.uid === 'wRbvUaFiBOYeXEEtF8OuXnzGWXs2' && liveRole !== 'admin') {
               await setDoc(doc(db, 'users', authUser.uid), { role: 'admin' }, { merge: true });
               liveRole = 'admin';
            }
            const finalUser = { ...authUser, ...userData, role: liveRole, requiresRole: false };
            setUser(finalUser);
            localStorage.setItem('fast_load_cache', JSON.stringify(finalUser));
          } else {
            setUser({ ...authUser, requiresRole: true });
          }
        } catch (error) {
          if (error.code === 'permission-denied') {
            setUser({ ...authUser, requiresRole: true });
          } else {
            console.error("Auth Firestore Error:", error);
          }
        } finally {
          setProfileLoaded(true);
        }
      } else {
        setUser(null);
        setProfileLoaded(true);
        localStorage.removeItem('fast_load_cache');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: loading || (!user && !profileLoaded), loginGoogle, loginEmail, registerEmail, resetPassword, setupRecaptcha, sendOTP, verifyOTP, logout, completeProfile }}>
      {(loading || (!user && !profileLoaded)) ? (
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
