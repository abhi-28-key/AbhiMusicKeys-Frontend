import { User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Enhanced purchase status checking with Firestore as primary source
export const getUserPlanStatus = async (currentUser: User | null): Promise<string> => {
  if (!currentUser) return 'Free Plan';
  
  try {
    // First, check Firestore for the most up-to-date purchase status
    const db = getFirestore();
    const userDoc = doc(db, 'users', currentUser.uid);
    const userData = await getDoc(userDoc);
    
    if (userData.exists()) {
      const data = userData.data();
      
      // Check for subscription status in Firestore
      if (data.subscription && data.subscription.active) {
        return 'Premium';
      }
      
      // Check for specific access flags in Firestore
      if (data.intermediateAccess || data.advancedAccess || data.hasPurchasedIndianStyles || 
          data.hasStylesTonesAccess || data.hasIndianStylesAccess) {
        return 'Premium';
      }
      
      // Check purchase status object
      if (data.purchaseStatus) {
        const purchaseStatus = data.purchaseStatus;
        if (purchaseStatus.intermediate || purchaseStatus.advanced || purchaseStatus.stylesTones || 
            purchaseStatus.indianStyles) {
          return 'Premium';
        }
      }
    }
    
    // Fallback to localStorage (for backward compatibility)
    const userSubscription = localStorage.getItem(`subscription_${currentUser.uid}`);
    if (userSubscription) {
      const subscription = JSON.parse(userSubscription);
      if (subscription.plan === 'intermediate' || subscription.plan === 'advanced') {
        return 'Premium';
      }
    }
    
    // Check for specific access flags in localStorage
    const intermediateAccess = localStorage.getItem(`intermediate_access_${currentUser.uid}`);
    const advancedAccess = localStorage.getItem(`advanced_access_${currentUser.uid}`);
    const stylesTonesAccess = localStorage.getItem(`styles_tones_access_${currentUser.uid}`);
    const indianStylesAccess = localStorage.getItem(`indian_styles_access_${currentUser.uid}`);
    
    if (intermediateAccess === 'true' || advancedAccess === 'true' || 
        stylesTonesAccess === 'true' || indianStylesAccess === 'true') {
      return 'Premium';
    }
    
    return 'Free Plan';
  } catch (error) {
    console.error('Error checking user plan status:', error);
    // Fallback to localStorage only
    return getUserPlanStatusFallback(currentUser);
  }
};

// Fallback function for when Firestore is unavailable
const getUserPlanStatusFallback = (currentUser: User | null): string => {
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
  const stylesTonesAccess = localStorage.getItem(`styles_tones_access_${currentUser.uid}`);
  const indianStylesAccess = localStorage.getItem(`indian_styles_access_${currentUser.uid}`);
  
  if (intermediateAccess === 'true' || advancedAccess === 'true' || 
      stylesTonesAccess === 'true' || indianStylesAccess === 'true') {
    return 'Premium';
  }
  
  return 'Free Plan';
};

// Enhanced function to check if user has access to a specific plan
export const hasPlanAccess = async (currentUser: User | null, planId: string): Promise<boolean> => {
  if (!currentUser) return false;
  
  try {
    // First check Firestore
    const db = getFirestore();
    const userDoc = doc(db, 'users', currentUser.uid);
    const userData = await getDoc(userDoc);
    
    if (userData.exists()) {
      const data = userData.data();
      
      // Check subscription
      if (data.subscription && data.subscription.active && data.subscription.plan === planId) {
        return true;
      }
      
      // Check specific access flags
      switch (planId) {
        case 'intermediate':
          return data.intermediateAccess === true || data.purchaseStatus?.intermediate === true;
        case 'advanced':
          return data.advancedAccess === true || data.purchaseStatus?.advanced === true;
        case 'styles-tones':
          return data.hasPurchasedIndianStyles === true || data.purchaseStatus?.stylesTones === true || 
                 data.hasStylesTonesAccess === true || data.hasIndianStylesAccess === true ||
                 data.purchaseStatus?.indianStyles === true;
        default:
          return false;
      }
    }
    
    // Fallback to localStorage
    return hasPlanAccessFallback(currentUser, planId);
  } catch (error) {
    console.error('Error checking plan access:', error);
    return hasPlanAccessFallback(currentUser, planId);
  }
};

// Fallback function for localStorage-only checking
const hasPlanAccessFallback = (currentUser: User | null, planId: string): boolean => {
  if (!currentUser) return false;
  
  switch (planId) {
    case 'intermediate':
      return localStorage.getItem(`intermediate_access_${currentUser.uid}`) === 'true';
    case 'advanced':
      return localStorage.getItem(`advanced_access_${currentUser.uid}`) === 'true';
    case 'styles-tones':
      return localStorage.getItem(`styles_tones_access_${currentUser.uid}`) === 'true' || 
             localStorage.getItem(`indian_styles_access_${currentUser.uid}`) === 'true';
    default:
      return false;
  }
};

// Function to sync purchase status from Firestore to localStorage
export const syncPurchaseStatusToLocalStorage = async (currentUser: User | null): Promise<void> => {
  if (!currentUser) return;
  
  try {
    const db = getFirestore();
    const userDoc = doc(db, 'users', currentUser.uid);
    const userData = await getDoc(userDoc);
    
    if (userData.exists()) {
      const data = userData.data();
      
      // Sync intermediate access
      if (data.intermediateAccess || data.purchaseStatus?.intermediate) {
        localStorage.setItem(`intermediate_access_${currentUser.uid}`, 'true');
        localStorage.setItem(`enrolled_${currentUser.uid}_intermediate`, 'true');
      }
      
      // Sync advanced access
      if (data.advancedAccess || data.purchaseStatus?.advanced) {
        localStorage.setItem(`advanced_access_${currentUser.uid}`, 'true');
        localStorage.setItem(`enrolled_${currentUser.uid}_advanced`, 'true');
      }
      
      // Sync styles & tones access
      if (data.hasPurchasedIndianStyles || data.purchaseStatus?.stylesTones || 
          data.hasStylesTonesAccess || data.hasIndianStylesAccess || data.purchaseStatus?.indianStyles) {
        localStorage.setItem(`styles_tones_access_${currentUser.uid}`, 'true');
        localStorage.setItem(`indian_styles_access_${currentUser.uid}`, 'true');
      }
      
      // Sync subscription data
      if (data.subscription) {
        localStorage.setItem(`subscription_${currentUser.uid}`, JSON.stringify(data.subscription));
      }
      
      console.log('✅ Purchase status synced from Firestore to localStorage');
    }
  } catch (error) {
    console.error('Error syncing purchase status:', error);
  }
};

// Function to update purchase status in Firestore
export const updatePurchaseStatusInFirestore = async (
  currentUser: User | null, 
  planId: string, 
  status: boolean
): Promise<void> => {
  if (!currentUser) return;
  
  try {
    const db = getFirestore();
    const userDoc = doc(db, 'users', currentUser.uid);
    
    const updateData: any = {
      lastUpdated: new Date()
    };
    
    switch (planId) {
      case 'intermediate':
        updateData.intermediateAccess = status;
        updateData['purchaseStatus.intermediate'] = status;
        break;
      case 'advanced':
        updateData.advancedAccess = status;
        updateData['purchaseStatus.advanced'] = status;
        break;
      case 'styles-tones':
        updateData.hasPurchasedIndianStyles = status;
        updateData.hasStylesTonesAccess = status;
        updateData['purchaseStatus.stylesTones'] = status;
        break;
      case 'indian-styles':
        updateData.hasPurchasedIndianStyles = status;
        updateData.hasIndianStylesAccess = status;
        updateData['purchaseStatus.indianStyles'] = status;
        break;
    }
    
    await updateDoc(userDoc, updateData);
    console.log(`✅ Purchase status updated in Firestore for plan: ${planId}`);
  } catch (error) {
    console.error('Error updating purchase status in Firestore:', error);
  }
};
