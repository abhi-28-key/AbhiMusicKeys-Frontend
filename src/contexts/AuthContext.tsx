import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import Loading from '../components/ui/loading';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string, displayName?: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email: string, password: string, displayName?: string) {
    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        displayName: displayName || '',
        role: 'user',
        plan: 'basic',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
        progress: {
          basicCompleted: 0,
          intermediateCompleted: 0,
          advancedCompleted: 0
        }
      });
      
      console.log('✅ User created successfully in both Auth and Firestore');
      // Fire welcome email (non-blocking)
      try {
        fetch(`${process.env.REACT_APP_API_URL}/send-welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: email, name: displayName || email.split('@')[0] })
        }).catch(() => {});
      } catch (_) {}
      return userCredential;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  // Login function
  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google sign in function
  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || '',
        role: 'user',
        plan: 'basic',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
        progress: {
          basicCompleted: 0,
          intermediateCompleted: 0,
          advancedCompleted: 0
        }
      }, { merge: true }); // merge: true will only update if document doesn't exist
      
      console.log('✅ Google user signed in and document created/updated in Firestore');
      // Fire welcome email for Google signups (first-time or returning; email is idempotent)
      try {
        fetch('http://localhost:5000/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: userCredential.user.email, name: userCredential.user.displayName || (userCredential.user.email || '').split('@')[0] })
        }).catch(() => {});
      } catch (_) {}
      return userCredential;
    } catch (error) {
      console.error('❌ Error with Google sign in:', error);
      throw error;
    }
  }

  // Logout function
  async function logout() {
    try {
      console.log('AuthContext: Starting logout...');
      await signOut(auth);
      console.log('AuthContext: Firebase signOut successful');
      return Promise.resolve();
    } catch (error) {
      console.error('AuthContext: Firebase signOut failed:', error);
      // Even if Firebase logout fails, we should still clear the local state
      setCurrentUser(null);
      throw error;
    }
  }

  // Password reset function
  async function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    signInWithGoogle,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
} 
