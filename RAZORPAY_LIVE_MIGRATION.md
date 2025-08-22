# 🔄 Razorpay: Test to Live Migration Quick Guide

## 🚨 **IMPORTANT: Before Going Live**

### **Prerequisites**
- ✅ Razorpay business verification completed
- ✅ All required documents uploaded and approved
- ✅ Domain name purchased
- ✅ SSL certificate installed (HTTPS required)

---

## 🔑 **API Key Changes**

### **Test Mode (Current)**
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
RAZORPAY_KEY_SECRET=YOUR_TEST_SECRET
```

### **Live Mode (Production)**
```env
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
```

**Key Difference**: `rzp_test_` → `rzp_live_`

---

## 📝 **Step-by-Step Migration**

### **Step 1: Get Live Keys**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Settings** → **API Keys**
3. Click **Generate Key Pair**
4. Copy both keys

### **Step 2: Update Backend (.env)**
```env
# Replace these lines in AbhiMusicKeys-Backend/.env
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
```

### **Step 3: Update Frontend (.env)**
```env
# Replace these lines in abhimusickeys/.env
REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
REACT_APP_API_URL=https://your-domain.com/api
```

### **Step 4: Test Locally**
```bash
# Restart backend
cd AbhiMusicKeys-Backend
npm start

# Restart frontend
cd abhimusickeys
npm start

# Test with ₹1 payment
```

### **Step 5: Deploy**
```bash
# Deploy backend first
cd AbhiMusicKeys-Backend
vercel

# Deploy frontend
cd abhimusickeys
vercel
```

---

## ⚠️ **Critical Differences**

| Aspect | Test Mode | Live Mode |
|--------|-----------|-----------|
| **API Keys** | `rzp_test_` | `rzp_live_` |
| **Payments** | Fake money | Real money |
| **Verification** | Not required | Required |
| **Webhooks** | Test URLs | Production URLs |
| **Dashboard** | Test transactions | Real transactions |

---

## 🧪 **Testing Strategy**

### **Before Going Live**
1. **Test with ₹1** - Smallest possible amount
2. **Verify in Dashboard** - Check Razorpay dashboard
3. **Test Failure** - Try failed payment scenarios
4. **Check Emails** - Verify notification emails

### **After Going Live**
1. **Monitor Success Rate** - Track payment success
2. **Check Logs** - Monitor server logs
3. **User Feedback** - Listen to user complaints
4. **Revenue Tracking** - Monitor actual revenue

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Authentication Failed"**
**Solution**: Check API keys are correct and live keys

### **Issue 2: "Business Verification Required"**
**Solution**: Complete Razorpay business verification

### **Issue 3: "CORS Error"**
**Solution**: Update CORS origin to your production domain

### **Issue 4: "Payment Not Processing"**
**Solution**: Check Razorpay account status and limits

---

## 📞 **Support Resources**

- **Razorpay Docs**: https://razorpay.com/docs/
- **Razorpay Support**: https://razorpay.com/support/
- **Status Page**: https://status.razorpay.com/

---

## ✅ **Final Checklist**

- [ ] Live API keys obtained
- [ ] Environment variables updated
- [ ] Tested locally with live keys
- [ ] Deployed to production
- [ ] Tested with real ₹1 payment
- [ ] Verified in Razorpay dashboard
- [ ] Email notifications working
- [ ] Admin panel accessible
- [ ] Mobile responsiveness checked

---

**🎯 You're ready to accept real payments!**
