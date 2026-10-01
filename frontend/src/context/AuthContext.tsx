import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  auth,
  isFirebaseConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (fullName: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginGuestDemo: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'llm_portal_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'AI Explorer',
            photoURL: fbUser.photoURL || undefined,
            createdAt: Date.now(),
            streakDays: 3,
            lastActiveDate: new Date().toISOString().split('T')[0],
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local persistent auth state
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        // Fallback local auth
        const namePart = email.split('@')[0];
        const localUser: UserProfile = {
          uid: 'usr_' + Math.random().toString(36).substring(2, 9),
          email,
          displayName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
          createdAt: Date.now(),
          streakDays: 2,
          lastActiveDate: new Date().toISOString().split('T')[0],
        };
        setUser(localUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await createUserWithEmailAndPassword(auth, email, pass);
      } else {
        const localUser: UserProfile = {
          uid: 'usr_' + Math.random().toString(36).substring(2, 9),
          email,
          displayName: fullName,
          createdAt: Date.now(),
          streakDays: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
        };
        setUser(localUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        const localUser: UserProfile = {
          uid: 'usr_google_' + Math.random().toString(36).substring(2, 9),
          email: 'student.google@university.edu',
          displayName: 'Google Scholar Student',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          createdAt: Date.now(),
          streakDays: 4,
          lastActiveDate: new Date().toISOString().split('T')[0],
        };
        setUser(localUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in was cancelled or failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginGuestDemo = async () => {
    setError(null);
    const guestUser: UserProfile = {
      uid: 'guest_demo_user',
      email: 'student@campus.edu',
      displayName: 'Alex Rivers (Student)',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      createdAt: Date.now() - 7 * 86400000,
      streakDays: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    setUser(guestUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(guestUser));
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      // simulate success
      await new Promise((r) => setTimeout(r, 600));
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        loginWithGoogle,
        loginGuestDemo,
        logout,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
