# 🚀 AbhiMusicKeys Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **Razorpay Live Setup**
- [ ] Complete Razorpay business verification
- [ ] Get live API keys from Razorpay dashboard
- [ ] Test live keys in development environment
- [ ] Update environment variables

### ✅ **Domain & SSL Setup**
- [ ] Purchase domain name
- [ ] Set up SSL certificate (HTTPS required for payments)
- [ ] Configure DNS settings

### ✅ **Backend Deployment**
- [ ] Choose hosting platform (Vercel, Netlify, Railway, etc.)
- [ ] Set up environment variables on hosting platform
- [ ] Deploy backend server
- [ ] Test API endpoints

### ✅ **Frontend Deployment**
- [ ] Build production version
- [ ] Deploy to hosting platform
- [ ] Update API URLs to production domain
- [ ] Test payment flow

---

## 🔄 **Razorpay: Test to Live Migration**

### **Step 1: Get Live API Keys**

1. **Login to Razorpay Dashboard**
   ```
   https://dashboard.razorpay.com/
   ```

2. **Complete Business Verification**
   - Go to **Settings** → **Account & Settings**
   - Upload required documents:
     - PAN Card
     - Aadhaar Card
     - Business Proof (GST, Shop License, etc.)
   - Wait for approval (24-48 hours)

3. **Generate Live API Keys**
   - Go to **Settings** → **API Keys**
   - Click **Generate Key Pair**
   - Copy **Key ID** and **Key Secret**
   - **Note**: Live keys start with `rzp_live_`

### **Step 2: Update Environment Variables**

#### **Backend (.env)**
```env
# Replace test keys with live keys
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Production Settings
NODE_ENV=production
PORT=5000
```

#### **Frontend (.env)**
```env
# Replace test keys with live keys
REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID

# Production API URL
REACT_APP_API_URL=https://your-domain.com/api

# Other settings
REACT_APP_ENVIRONMENT=production
```

### **Step 3: Test Live Mode Locally**

1. **Update your local .env files**
2. **Restart your development servers**
3. **Test payment flow with small amounts**
4. **Verify payment success in Razorpay dashboard**

---

## 🌐 **Deployment Options**

### **Option 1: Vercel (Recommended)**

#### **Backend Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd AbhiMusicKeys-Backend
vercel

# Set environment variables
vercel env add RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
```

#### **Frontend Deployment**
```bash
# Deploy frontend
cd abhimusickeys
vercel

# Set environment variables
vercel env add REACT_APP_RAZORPAY_KEY_ID
vercel env add REACT_APP_API_URL
```

### **Option 2: Railway**

1. **Connect GitHub repository**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push**

### **Option 3: Netlify**

1. **Connect GitHub repository**
2. **Set build command: `npm run build`**
3. **Set publish directory: `build`**
4. **Add environment variables in Netlify dashboard**

---

## 🔧 **Production Configuration**

### **Backend Production Settings**

Update your backend for production:

```javascript
// server.js - Production settings
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS settings for production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-domain.com',
  credentials: true
}));

// Security headers
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
```

### **Frontend Production Build**

```bash
# Build for production
npm run build

# Test production build locally
npx serve -s build
```

---

## 🧪 **Testing Checklist**

### **Payment Testing**
- [ ] Test with ₹1 amount first
- [ ] Verify payment success in Razorpay dashboard
- [ ] Check email notifications
- [ ] Test payment failure scenarios
- [ ] Verify user plan upgrade after payment

### **Security Testing**
- [ ] HTTPS is working
- [ ] API keys are not exposed in frontend
- [ ] Payment verification is working
- [ ] User authentication is secure

### **Functionality Testing**
- [ ] User registration/login
- [ ] Course access after payment
- [ ] Admin panel access
- [ ] Email notifications
- [ ] Mobile responsiveness

---

## 🚨 **Important Security Notes**

### **Environment Variables**
- ✅ **DO**: Use environment variables for API keys
- ❌ **DON'T**: Hardcode API keys in code
- ❌ **DON'T**: Commit .env files to Git

### **API Security**
- ✅ **DO**: Use HTTPS in production
- ✅ **DO**: Validate payment signatures
- ✅ **DO**: Implement rate limiting
- ❌ **DON'T**: Trust client-side data

### **Payment Security**
- ✅ **DO**: Verify payments on server-side
- ✅ **DO**: Use webhooks for payment updates
- ✅ **DO**: Log all payment activities
- ❌ **DON'T**: Skip payment verification

---

## 📞 **Support & Troubleshooting**

### **Common Issues**

1. **Payment Not Processing**
   - Check API keys are correct
   - Verify business verification is complete
   - Check Razorpay account status

2. **CORS Errors**
   - Update CORS origin to your domain
   - Check frontend API URL is correct

3. **Email Not Sending**
   - Verify Gmail app password
   - Check email configuration

### **Razorpay Support**
- **Documentation**: https://razorpay.com/docs/
- **Support**: https://razorpay.com/support/
- **Status Page**: https://status.razorpay.com/

---

## 🎉 **Go Live Checklist**

### **Final Steps**
- [ ] All tests passing
- [ ] Live API keys configured
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Email notifications working
- [ ] Admin panel accessible
- [ ] Payment flow tested with real money
- [ ] Backup strategy in place

### **Post-Launch Monitoring**
- [ ] Monitor payment success rates
- [ ] Check server logs regularly
- [ ] Monitor user feedback
- [ ] Track revenue analytics
- [ ] Regular security updates

---

**🎯 You're ready to go live! Good luck with your music learning platform!**
