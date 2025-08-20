import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { isAuthorizedAdmin } from '../../utils/adminSetup';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the encrypted hash from the current URL
  const getEncryptedHash = () => {
    const parts = location.pathname.split('/');
    return parts[2]; // The hash part of /secure-admin-panel/{hash}/...
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Admin login attempt for:', email);
      
      // 🔒 SECURITY CHECK: Only authorized admin email can access
      if (!isAuthorizedAdmin(email)) {
        throw new Error('❌ UNAUTHORIZED: Only the platform owner can access admin panel');
      }

      console.log('✅ Email authorized, attempting Firebase login...');

      // First, authenticate with Firebase
      const userCredential = await login(email, password);
      console.log('✅ Firebase authentication successful');
      
             // Check if user is admin by looking up their role in Firestore
       try {
         const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
         
         if (!userDoc.exists()) {
           console.log('⚠️ User not found in database, creating admin user...');
           // Create admin user if not exists
           await setDoc(doc(db, 'users', userCredential.user.uid), {
             email: email,
             displayName: 'Admin',
             role: 'admin',
             plan: 'admin',
             createdAt: new Date(),
             lastLogin: new Date(),
             isActive: true,
             progress: {
               basicCompleted: 0,
               intermediateCompleted: 0,
               advancedCompleted: 0
             }
           });
           console.log('✅ Admin user created in database');
         } else {
           const userData = userDoc.data();
           console.log('📋 User data:', userData);
           if (userData.role !== 'admin') {
             throw new Error('Access denied. Admin privileges required.');
           }
           console.log('✅ User has admin role');
         }
       } catch (firestoreError: any) {
         console.warn('⚠️ Firestore error (possibly offline):', firestoreError);
         
         // If it's an offline error, we'll trust the email authorization
         if (firestoreError.message.includes('offline') || firestoreError.message.includes('Failed to get document')) {
           console.log('🌐 Offline mode detected - proceeding with email authorization');
           console.log('✅ Admin access granted based on email authorization');
         } else {
           // Re-throw other Firestore errors
           throw firestoreError;
         }
       }

             // If we get here, user is authenticated and is an admin
       // Navigate to the encrypted admin dashboard URL
       const encryptedHash = getEncryptedHash();
       const dashboardUrl = `/secure-admin-panel/${encryptedHash}/dashboard`;
       console.log('🚀 Navigating to dashboard:', dashboardUrl);
       console.log('📍 Current location:', window.location.pathname);
       console.log('🔑 Encrypted hash:', encryptedHash);
       
               // Show success message and navigate immediately
        setSuccess(true);
        setLoading(false);
        
        console.log('⏰ Navigating to dashboard immediately...');
        navigate(dashboardUrl);
    } catch (error: any) {
      console.error('❌ Admin login error:', error);
      setError(error.message || 'Failed to login as admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Secure access to course management</p>
        </div>

                 {error && (
           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
             {error}
           </div>
         )}

         {success && (
           <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
             ✅ Login successful! Redirecting to dashboard...
           </div>
         )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@abhimusickeys.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your admin password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔐 Secure encrypted admin access
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
