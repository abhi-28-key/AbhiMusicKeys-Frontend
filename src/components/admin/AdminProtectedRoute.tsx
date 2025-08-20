import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Loading from '../ui/loading';
import { isAuthorizedAdmin } from '../../utils/adminSetup';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        // 🔒 SECURITY CHECK: Only authorized admin email can access
        if (!isAuthorizedAdmin(currentUser.email || '')) {
          setIsAdmin(false);
          setCheckingAdmin(false);
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (!userDoc.exists()) {
          setIsAdmin(false);
        } else {
          const userData = userDoc.data();
          setIsAdmin(userData.role === 'admin');
        }
      } catch (error: any) {
        console.warn('⚠️ Firestore error (possibly offline):', error);
        
        // If it's an offline error, trust email authorization
        if (error.message.includes('offline') || error.message.includes('Failed to get document')) {
          setIsAdmin(isAuthorizedAdmin(currentUser.email || ''));
        } else {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [currentUser, loading]);

  // Show loading while checking authentication and admin status
  if (loading || checkingAdmin) {
    return <Loading />;
  }

  // Redirect to admin login if not authenticated or not admin
  if (!currentUser || !isAdmin) {
    // Get the current admin URL hash and redirect to admin login
    const currentPath = window.location.pathname;
    const parts = currentPath.split('/');
    const hash = parts[2]; // Get the hash from /secure-admin-panel/{hash}/...
    const redirectUrl = `/secure-admin-panel/${hash}`;
    return <Navigate to={redirectUrl} replace />;
  }

  // Render children if user is authenticated and is admin
  return <>{children}</>;
};

export default AdminProtectedRoute;
