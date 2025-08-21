import { User } from 'firebase/auth';

export const getUserPlanStatus = (currentUser: User | null): string => {
  if (!currentUser) return 'Free Plan';
  
  // Check if user has intermediate or advanced subscription
  const userSubscription = localStorage.getItem(`subscription_${currentUser.uid}`);
  if (userSubscription) {
    const subscription = JSON.parse(userSubscription);
    if (subscription.plan === 'intermediate' || subscription.plan === 'advanced') {
      return 'Premium';
    }
  }
  
  // Check for specific access flags
  const intermediateAccess = localStorage.getItem(`intermediate_access_${currentUser.uid}`);
  const advancedAccess = localStorage.getItem(`advanced_access_${currentUser.uid}`);
  
  if (intermediateAccess === 'true' || advancedAccess === 'true') {
    return 'Premium';
  }
  
  // Default to Free Plan
  return 'Free Plan';
};
