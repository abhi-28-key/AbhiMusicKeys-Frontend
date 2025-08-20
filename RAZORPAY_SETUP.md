# Razorpay Payment Integration Setup

This guide will help you set up Razorpay payment integration for AbhiMusicKeys.

## 1. Razorpay Account Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a Razorpay account
3. Complete your business verification
4. Get your API keys from the dashboard

## 2. Environment Variables

Create a `.env` file in the root directory with your Razorpay credentials:

```env
# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
REACT_APP_RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

# Backend API URL (if you have a separate backend)
REACT_APP_API_URL=http://localhost:5000/api
```

## 3. Backend API Setup

You'll need a backend server to handle payment processing. Here's a basic Express.js setup:

### Install Dependencies
```bash
npm install express cors dotenv razorpay crypto
```

### Basic Server Setup (server.js)
```javascript
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, planId, userId, userEmail } = req.body;
    
    const options = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: `order_${Date.now()}`,
      notes: {
        planId: planId,
        userId: userId,
        userEmail: userEmail,
      },
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify Payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planId,
      userId,
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Here you should:
      // 1. Update user subscription in your database
      // 2. Send confirmation email
      // 3. Log the successful payment
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        planId: planId,
        userId: userId,
      });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 4. Firebase Integration

Update your Firebase Firestore to store subscription data:

```javascript
// In your PaymentContext.tsx, after successful payment:
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// After payment verification
const updateUserSubscription = async (userId, planData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const subscriptionRef = doc(db, 'subscriptions', userId);
    
    await setDoc(subscriptionRef, {
      planId: planData.planId,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + getPlanDuration(planData.planId)),
      paymentId: planData.paymentId,
      orderId: planData.orderId,
    });
    
    await updateDoc(userRef, {
      hasActiveSubscription: true,
      currentPlan: planData.planId,
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
  }
};
```

## 5. Testing

1. Use Razorpay test mode for development
2. Test with these test card numbers:
   - Success: 4111 1111 1111 1111
   - Failure: 4000 0000 0000 0002

## 6. Production Deployment

1. Switch to Razorpay live mode
2. Update environment variables with live keys
3. Set up webhook endpoints for payment notifications
4. Implement proper error handling and logging

## 7. Security Considerations

1. Always verify payments on the server side
2. Use HTTPS in production
3. Implement proper input validation
4. Store sensitive data securely
5. Implement rate limiting

## 8. Additional Features to Implement

1. **Subscription Management**
   - Cancel subscription
   - Upgrade/downgrade plans
   - Payment history

2. **Webhook Handling**
   - Payment success/failure notifications
   - Subscription status updates

3. **Email Notifications**
   - Payment confirmation
   - Subscription reminders
   - Welcome emails

4. **Analytics**
   - Payment analytics
   - Revenue tracking
   - User engagement metrics

## 9. Troubleshooting

### Common Issues:

1. **Payment not processing**
   - Check API keys
   - Verify amount format (should be in paise)
   - Check network connectivity

2. **Signature verification failing**
   - Ensure key secret is correct
   - Check signature generation logic

3. **Order creation failing**
   - Verify Razorpay account status
   - Check API rate limits

### Support:
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com 