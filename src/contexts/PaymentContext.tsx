import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  isRecommended?: boolean;
}

interface PaymentContextType {
  plans: PaymentPlan[];
  selectedPlan: PaymentPlan | null;
  setSelectedPlan: (plan: PaymentPlan | null) => void;
  isProcessing: boolean;
  processPayment: (plan: PaymentPlan) => Promise<void>;
  userSubscription: any;
  loadingSubscription: boolean;
  hasSubscription: (planId: string) => boolean;
  grantSubscription: (planId: string) => void;
  revokeSubscription: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  const plans: PaymentPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 0,
      duration: 'Free for registered users',
      features: [
        'Basic piano fundamentals',
        'Major and minor scales',
        'Simple chord progressions',
        'Basic finger exercises',
        'Introduction to music theory'
      ]
    },
    {
      id: 'intermediate',
      name: 'Intermediate Plan',
      price: 399,
      duration: 'Lifetime Access',
      popular: true,
      features: [
        'Everything in Basic Plan',
        '7th Chords & Sharp 7th Chords',
        'Diminished & Sharp Diminished Chords',
        'Suspended & Sharp Suspended Chords',
        'Add 9th & Sharp Add 9th Chords',
        'Major Families (7-CHORDS each)',
        'Minor Families (7-CHORDS each)',
        'Practicing Family Chords Major and Minor',
        'How to Use Transpose',
        'Lifetime Access to All Content'
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced Plan',
      price: 699,
      duration: 'Lifetime Access',
      features: [
        'Everything in Intermediate Plan',
        'Advanced Major & Minor Families (C, D, E, F, G, A, B & C#, D#, F#, G#, A#)',
        '15 Traditional Indian Ragas with Chord Progressions',
        'Scale Identification Techniques',
        'Professional Interlude Playing Mastery',
        'Lifetime Access to All Content'
      ],
      isRecommended: true
    }
  ];

  const processPayment = async (plan: PaymentPlan) => {
    if (!currentUser) {
      throw new Error('User must be logged in to make a payment');
    }

    setIsProcessing(true);
    try {
      console.log('Starting payment process for plan:', plan.name);
      console.log('Razorpay Key:', process.env.REACT_APP_RAZORPAY_KEY_ID);
      console.log('API URL:', process.env.REACT_APP_API_URL);
      
             // Check if we're on mobile
       const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
       console.log('Is Mobile Device:', isMobile);
       
       // Check network connectivity
       if (!navigator.onLine) {
         throw new Error('No internet connection. Please check your network and try again.');
       }
      
             // Create order first (before loading script)
       console.log('Creating order with backend...');
       
       // Use hardcoded backend URL for mobile compatibility
       const apiUrl = 'https://abhimusickeys-backend.onrender.com';
       console.log('Using backend URL:', apiUrl);
       
       // Test backend connectivity
       try {
         const healthResponse = await fetch(`${apiUrl}/api/health`);
         if (healthResponse.ok) {
           console.log('Backend is accessible');
         } else {
           console.warn('Backend health check failed');
         }
       } catch (error) {
         console.error('Backend connectivity test failed:', error);
       }
       
              let orderResponse;
       try {
         orderResponse = await fetch(`${apiUrl}/api/create-order`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             planId: plan.id,
             amount: plan.price * 100, // Razorpay expects amount in paise
             currency: 'INR',
             userId: currentUser.uid,
             userEmail: currentUser.email,
           }),
         });
       } catch (networkError) {
         console.error('Network error:', networkError);
         throw new Error(`Network error: Unable to connect to server. Please check your internet connection and try again.`);
       }

       console.log('Order response status:', orderResponse.status);
      
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Order creation failed:', errorText);
        throw new Error(`Failed to create order: ${errorText}`);
      }

      const orderData = await orderResponse.json();
      console.log('Order created successfully:', orderData);
      
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      // Add timeout for script loading
      const scriptTimeout = setTimeout(() => {
        console.error('Razorpay script loading timeout');
        throw new Error('Razorpay script loading timeout');
      }, 15000); // 15 seconds timeout for mobile
      
      document.body.appendChild(script);

                           script.onload = async () => {
          try {
            clearTimeout(scriptTimeout); // Clear timeout on successful load
            console.log('Razorpay script loaded successfully');

          // Initialize Razorpay
          const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID';
          console.log('Using Razorpay key:', razorpayKey);
          
                     const options = {
             key: razorpayKey,
             amount: orderData.order.amount,
             currency: orderData.order.currency,
             name: 'AbhiMusicKeys',
             description: `${plan.name}${plan.duration ? ` - ${plan.duration}` : ''}`,
             image: 'https://abhi-music-keys-frontend.vercel.app/favicon.ico',
             order_id: orderData.order.id,
             // Simplified mobile options
             modal: {
               ondismiss: function() {
                 console.log('Payment modal dismissed');
                 setIsProcessing(false);
               }
             },
             // Mobile-optimized configuration (simplified for better compatibility)
           ...(isMobile ? {
             config: {
               display: {
                 blocks: {
                   upi: {
                     name: "Pay via UPI",
                     instruments: [
                       {
                         method: "upi"
                       }
                     ]
                   }
                 },
                 sequence: ["block.upi"],
                 preferences: {
                   show_default_blocks: false
                 }
               }
             }
           } : {}),
            handler: async (response: any) => {
              try {
                                                  // Verify payment on your backend
                 let verifyResponse;
                 try {
                   verifyResponse = await fetch(`${apiUrl}/api/verify-payment`, {
                     method: 'POST',
                     headers: {
                       'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                       razorpay_payment_id: response.razorpay_payment_id,
                       razorpay_order_id: response.razorpay_order_id,
                       razorpay_signature: response.razorpay_signature,
                       planId: plan.id,
                       userId: currentUser.uid,
                       userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
                       userEmail: currentUser.email || '',
                       planName: plan.name,
                       amount: plan.price,
                       planDuration: plan.duration,
                     }),
                   });
                 } catch (networkError) {
                   console.error('Payment verification network error:', networkError);
                   throw new Error(`Network error during payment verification. Please contact support.`);
                 }

                if (!verifyResponse.ok) {
                  throw new Error('Payment verification failed');
                }

                const verificationData = await verifyResponse.json();
                
                // Grant subscription locally
                grantSubscription(plan.id);
                
                // Update user subscription in Firebase
                // You'll need to implement this based on your Firebase structure
                console.log('Payment successful:', verificationData);
                
                // Show success message and redirect
                console.log('Payment successful:', verificationData);
                
                // Redirect to payment success page with payment details
                window.location.href = `/payment-success?planId=${plan.id}&paymentId=${response.razorpay_payment_id}`;
                
              } catch (error) {
                console.error('Payment verification failed:', error);
                alert('Payment verification failed. Please contact support.');
              }
            },
            prefill: {
              name: currentUser.displayName || currentUser.email?.split('@')[0] || '',
              email: currentUser.email || '',
            },
            theme: {
              color: '#6366f1',
            },
          };

                     console.log('Initializing Razorpay with options:', options);
           
           // Check if Razorpay is available
           if (typeof (window as any).Razorpay === 'undefined') {
             throw new Error('Razorpay script not loaded properly');
           }
           
           const razorpay = new (window as any).Razorpay(options);
           
           // Enhanced error handling for mobile
           razorpay.on('payment.failed', function (resp: any) {
             console.error('Payment failed:', resp.error);
             setIsProcessing(false);
             alert(`Payment failed: ${resp.error.description || 'Unknown error'}. Please try again.`);
           });
           
           razorpay.on('payment.cancelled', function (resp: any) {
             console.log('Payment cancelled by user');
             setIsProcessing(false);
             alert('Payment was cancelled. You can try again anytime.');
           });
           
           razorpay.on('payment.error', function (resp: any) {
             console.error('Payment error:', resp.error);
             setIsProcessing(false);
             alert(`Payment error: ${resp.error.description || 'Something went wrong'}. Please try again.`);
           });
           
           // Open payment modal
           console.log('Opening Razorpay modal...');
           
           // Try to open with error handling
           try {
             razorpay.open();
           } catch (openError) {
             console.error('Failed to open Razorpay modal:', openError);
             
             // Fallback for mobile - try with minimal configuration
             if (isMobile) {
               console.log('Trying fallback mobile configuration...');
               const fallbackOptions = {
                 key: razorpayKey,
                 amount: orderData.order.amount,
                 currency: orderData.order.currency,
                 name: 'AbhiMusicKeys',
                 description: `${plan.name}${plan.duration ? ` - ${plan.duration}` : ''}`,
                 order_id: orderData.order.id,
                 handler: options.handler,
                 prefill: options.prefill,
                 theme: options.theme,
               };
               
               const fallbackRazorpay = new (window as any).Razorpay(fallbackOptions);
               fallbackRazorpay.open();
             } else {
               throw openError;
             }
           }

        } catch (error) {
          console.error('Payment initialization failed:', error);
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          alert(`Payment initialization failed: ${errorMessage}. Please try again.`);
        }
      };

      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        throw new Error('Failed to load Razorpay script');
      };

    } catch (error) {
      console.error('Payment processing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Payment processing failed: ${errorMessage}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasSubscription = (planId: string): boolean => {
    if (!currentUser) return false;
    
    if (planId === 'basic') {
      return true; // Basic plan is free for registered users
    }
    
    const userSubscription = localStorage.getItem(`subscription_${currentUser.uid}`);
    if (userSubscription) {
      const subscription = JSON.parse(userSubscription);
      return subscription.plan === planId && subscription.active;
    }
    
    return false;
  };

  const grantSubscription = (planId: string) => {
    if (!currentUser) return;
    
    const subscription = {
      plan: planId,
      active: true,
      grantedAt: new Date().toISOString(),
      expiresAt: planId === 'intermediate' 
        ? new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString() // 6 months
        : new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString() // 12 months
    };
    
    localStorage.setItem(`subscription_${currentUser.uid}`, JSON.stringify(subscription));
    
    // Set specific access flags for course access
    if (planId === 'intermediate') {
      localStorage.setItem(`intermediate_access_${currentUser.uid}`, 'true');
    } else if (planId === 'advanced') {
      // Advanced course automatically unlocks intermediate course too
      localStorage.setItem(`advanced_access_${currentUser.uid}`, 'true');
      localStorage.setItem(`intermediate_access_${currentUser.uid}`, 'true');
    }
    
    // No page reload - let React handle the state updates
    console.log(`Subscription granted for plan: ${planId}`);
  };

  const revokeSubscription = () => {
    if (!currentUser) return;
    localStorage.removeItem(`subscription_${currentUser.uid}`);
  };

  // Load user subscription on mount
  useEffect(() => {
    if (currentUser) {
      setLoadingSubscription(true);
      // Load user subscription from Firebase
      // You'll need to implement this based on your Firebase structure
      setLoadingSubscription(false);
    }
  }, [currentUser]);

  const value: PaymentContextType = {
    plans,
    selectedPlan,
    setSelectedPlan,
    isProcessing,
    processPayment,
    userSubscription,
    loadingSubscription,
    hasSubscription,
    grantSubscription,
    revokeSubscription
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}; 
