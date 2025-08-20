import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: 'basic' | 'intermediate' | 'advanced';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPlan = 'basic',
  redirectTo = '/pricing'
}) => {
  const { currentUser } = useAuth();

  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required plan
  const hasRequiredPlan = () => {
    // This would typically check against user's subscription in Firebase
    // For now, we'll use localStorage to simulate subscription status
    const userSubscription = localStorage.getItem(`subscription_${currentUser.uid}`);
    
    if (requiredPlan === 'basic') {
      // Basic plan is free for registered users
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
    
    if (userSubscription) {
      const subscription = JSON.parse(userSubscription);
      return subscription.plan === requiredPlan && subscription.active;
    }
    
    return false;
  };

  if (!hasRequiredPlan()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
