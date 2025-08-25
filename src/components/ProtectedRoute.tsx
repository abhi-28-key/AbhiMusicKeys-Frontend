import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasPlanAccess, syncPurchaseStatusToLocalStorage } from '../utils/userPlanUtils';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: 'basic' | 'intermediate' | 'advanced' | 'styles-tones';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPlan = 'basic',
  redirectTo = '/pricing'
}) => {
  const { currentUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUser) {
        setIsCheckingAccess(false);
        return;
      }

      try {
        // First, sync purchase status from Firestore to localStorage
        await syncPurchaseStatusToLocalStorage(currentUser);
        
        if (requiredPlan === 'basic') {
          // Basic plan is free for registered users
          setHasAccess(true);
        } else {
          // Check if user has the required plan access
          const access = await hasPlanAccess(currentUser, requiredPlan);
          setHasAccess(access);
        }
      } catch (error) {
        console.error('Error checking plan access:', error);
        // Fallback to localStorage-only check
        setHasAccess(checkLocalStorageAccess());
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [currentUser, requiredPlan]);

  // Fallback function for localStorage-only checking
  const checkLocalStorageAccess = (): boolean => {
    if (!currentUser) return false;
    
    if (requiredPlan === 'basic') {
      return true;
    }
    
    // For advanced plan, also check the advanced access flag
    if (requiredPlan === 'advanced') {
      const advancedAccess = localStorage.getItem(`advanced_access_${currentUser.uid}`);
      if (advancedAccess === 'true') {
        return true;
      }
    }
    
    // For intermediate plan, check the intermediate access flag
    if (requiredPlan === 'intermediate') {
      const intermediateAccess = localStorage.getItem(`intermediate_access_${currentUser.uid}`);
      if (intermediateAccess === 'true') {
        return true;
      }
    }
    
    // For styles-tones plan
    if (requiredPlan === 'styles-tones') {
      const stylesTonesAccess = localStorage.getItem(`styles_tones_access_${currentUser.uid}`);
      if (stylesTonesAccess === 'true') {
        return true;
      }
    }
    
    // Check subscription
    const userSubscription = localStorage.getItem(`subscription_${currentUser.uid}`);
    if (userSubscription) {
      const subscription = JSON.parse(userSubscription);
      return subscription.plan === requiredPlan && subscription.active;
    }
    
    return false;
  };

  // Show loading state while checking access
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Checking Access...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Verifying your purchase status...
          </p>
        </div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have required plan, redirect to specified page
  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
