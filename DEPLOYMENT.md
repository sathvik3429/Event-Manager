# 🚀 Deploy CampusHub to Vercel

## 📋 Prerequisites
- Vercel account (free)
- GitHub account
- Firebase project already set up

## 🔧 Step-by-Step Deployment

### 1. **Push to GitHub**
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create GitHub repository and push
git branch -M main
git remote add origin https://github.com/yourusername/campushub.git
git push -u origin main
```

### 2. **Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. **Import Git Repository** → Select your GitHub repo
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. **Add Environment Variables in Vercel**
In Vercel dashboard → Settings → Environment Variables:
```
VITE_FIREBASE_API_KEY=AIzaSyCEo320vdZL9Ylxe3VGDljKHfUP5lEFj1Q
VITE_FIREBASE_AUTH_DOMAIN=eventbuilder-b55e2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eventbuilder-b55e2
VITE_FIREBASE_STORAGE_BUCKET=eventbuilder-b55e2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=736192271406
VITE_FIREBASE_APP_ID=1:736192271406:web:6a75146caf6c0818c2fbbf
```

### 4. **Deploy**
- Click **"Deploy"**
- Wait for deployment (2-3 minutes)
- Your app will be live at `your-project-name.vercel.app`

## 🔧 Firebase Configuration for Production

### Update Firebase Auth Domains
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `eventbuilder-b55e2` project
3. Authentication → Settings → Authorized domains
4. Add your Vercel domain: `your-project-name.vercel.app`

### Update Firestore Rules
Make sure your Firestore rules allow web access:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.organizerId == request.auth.uid;
    }
    
    match /registrations/{registrationId} {
      allow read, write: if request.auth != null && 
        registrationId.split('_')[0] == request.auth.uid;
    }
  }
}
```

## 🎯 Post-Deployment Checklist

- [ ] Test login/signup functionality
- [ ] Test event creation
- [ ] Test event registration
- [ ] Test all navigation links
- [ ] Check mobile responsiveness
- [ ] Verify Firebase Firestore connectivity
- [ ] Test Google OAuth

## 🚨 Common Issues & Solutions

### Issue: "Firebase configuration not found"
**Solution**: Make sure all environment variables are set in Vercel

### Issue: "Blank page after deployment"
**Solution**: Check Vercel logs, ensure build completed successfully

### Issue: "Authentication not working"
**Solution**: Add your Vercel domain to Firebase authorized domains

### Issue: "Firestore permissions denied"
**Solution**: Update Firestore security rules in Firebase console

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployments

## 📊 Monitoring

- Check Vercel Analytics for performance
- Monitor Firebase usage in Firebase console
- Set up error tracking with Vercel logs

## 🎉 Success!

Your CampusHub app is now live! Share the URL with your campus community.

**Next Steps:**
- Add custom domain
- Set up analytics
- Add more features
- Gather user feedback
