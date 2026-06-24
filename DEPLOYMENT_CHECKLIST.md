# 🚀 Deployment Checklist - Video Persistence Fix

## Pre-Deployment Verification ✅

### 1. Verify Files Changed
Check that these 4 files were modified:
- [ ] `frontend/src/lib/models/HomeContent.ts` (added factory, woodCatalog, cta schemas)
- [ ] `frontend/src/components/premium/FactoryShowcase.tsx` (fetch from database first)
- [ ] `frontend/src/components/premium/WoodCatalog.tsx` (fetch from database first)
- [ ] `frontend/src/components/premium/CallToAction.tsx` (fetch from database first)

### 2. Local Testing

#### Test A: Build Success
```bash
cd frontend
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No linting errors

#### Test B: Local Development
```bash
npm run dev
```
- [ ] Open http://localhost:3000
- [ ] Check browser console (F12)
- [ ] Look for: `✅ FactoryShowcase: Loaded from database`
- [ ] Verify videos play correctly

#### Test C: Admin Panel
```bash
# 1. Go to http://localhost:3000/admin/login
# 2. Login with credentials
# 3. Go to Homepage > Accueil
# 4. Upload a new video
# 5. Click "Enregistrer"
```
- [ ] Video uploads successfully (green checkmark)
- [ ] No console errors
- [ ] Video URL shows in green text

#### Test D: Persistence Test
```bash
# 1. Upload and save a video in admin
# 2. Close browser completely
# 3. Reopen browser
# 4. Go to homepage
```
- [ ] Video still shows after restart
- [ ] Console shows: `✅ Loaded from database`

---

## Deployment Steps 🚀

### Step 1: Commit Changes
```bash
git add .
git commit -m "Fix: Load videos from database instead of localStorage

- Updated HomeContent model with factory, woodCatalog, cta sections
- Changed FactoryShowcase, WoodCatalog, CallToAction to fetch from DB first
- localStorage now used as fallback only
- Fixes video persistence across devices and browser restarts"

git push origin main
```

### Step 2: Verify MongoDB Atlas Connection
- [ ] MongoDB Atlas cluster is running
- [ ] Connection string in `.env` is correct
- [ ] Database has `home_content` collection

### Step 3: Verify Cloudinary Settings
- [ ] Cloudinary cloud name is correct: `dfaqnx5j3`
- [ ] Upload preset exists: `ebenor_videos`
- [ ] Videos folder configured: `ebenor/videos/homepage`

### Step 4: Deploy to Vercel
```bash
# If you have Vercel CLI:
vercel --prod

# OR push to GitHub and let Vercel auto-deploy
git push origin main
```

### Step 5: Wait for Deployment
- [ ] Vercel build succeeds
- [ ] No build errors in Vercel logs
- [ ] Deployment URL is live

---

## Post-Deployment Testing 🧪

### Test 1: Production Homepage
```
1. Open your production URL
2. Open browser console (F12)
3. Look for database fetch logs
```
- [ ] Videos load correctly
- [ ] No 404 errors for videos
- [ ] Console shows: `✅ Loaded from database`

### Test 2: Admin Upload in Production
```
1. Go to https://your-site.vercel.app/admin/login
2. Login with admin credentials
3. Go to Homepage > Accueil
4. Upload a new video
5. Click "Enregistrer"
```
- [ ] Video uploads to Cloudinary
- [ ] Green checkmark appears
- [ ] "Page d'accueil mise à jour!" message shows
- [ ] No console errors

### Test 3: Private/Incognito Mode
```
1. Open new private/incognito window
2. Go to production homepage
```
- [ ] Videos show correctly
- [ ] No black boxes
- [ ] Console shows: `✅ Loaded from database`

### Test 4: Different Device
```
1. Open site on mobile phone
2. Check if videos uploaded on desktop show
```
- [ ] Videos visible on mobile
- [ ] Videos play correctly
- [ ] Layout is responsive

### Test 5: Browser Restart
```
1. Close all browser windows
2. Reopen browser
3. Go to homepage
```
- [ ] Videos persist after restart
- [ ] No need to re-upload

---

## Troubleshooting 🔧

### Issue: Videos Don't Show
**Check:**
1. Open console - any errors?
2. Database connection working?
   ```
   # Check Vercel logs for MongoDB connection errors
   ```
3. Video URLs in database?
   ```javascript
   // In MongoDB Compass or Atlas:
   db.home_content.findOne()
   // Should show factory.video1Url, woodCatalog.videoUrl, etc.
   ```

### Issue: Database Shows Empty
**Solution:**
1. Go to admin panel
2. Re-upload videos
3. **IMPORTANT:** Click "Enregistrer" button
4. Verify green success message appears

### Issue: 404 Errors for Videos
**Check:**
1. Cloudinary URLs correct?
2. Videos actually uploaded to Cloudinary?
3. Check Cloudinary dashboard: Media Library

### Issue: Build Fails on Vercel
**Check:**
1. Vercel logs for specific error
2. TypeScript errors?
   ```bash
   npm run build
   ```
3. Environment variables set in Vercel?
   - `MONGODB_URI`
   - `NEXT_PUBLIC_API_URL`

---

## Rollback Plan 🔄

If something goes wrong:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Vercel will auto-deploy the reverted version
```

**OR** in Vercel dashboard:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

---

## Success Criteria ✅

Deployment is successful when:
- [ ] ✅ Build succeeds on Vercel
- [ ] ✅ Homepage loads without errors
- [ ] ✅ Videos play correctly
- [ ] ✅ Admin can upload new videos
- [ ] ✅ Videos persist after browser restart
- [ ] ✅ Videos show on different devices
- [ ] ✅ Videos show in incognito mode
- [ ] ✅ Console logs show database loading

---

## Final Verification Commands

### Check Production Site
```bash
# Test API endpoint directly
curl https://your-site.vercel.app/api/home

# Should return JSON with:
# - data.factory.video1Url
# - data.factory.video2Url
# - data.woodCatalog.videoUrl
# - data.cta.backgroundImage
```

### Check Database
```javascript
// In MongoDB Atlas or Compass:
db.home_content.findOne({}, {
  'factory.video1Url': 1,
  'factory.video2Url': 1,
  'woodCatalog.videoUrl': 1,
  'cta.backgroundImage': 1
})

// Should show URLs for all videos
```

---

## 🎉 Deployment Complete!

When all checks pass:
1. ✅ Videos persist across sessions
2. ✅ Videos work on all devices
3. ✅ No more black boxes
4. ✅ No more localStorage dependency

**The issue is fixed and deployed! 🚀**

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Check browser console for errors
4. Verify environment variables in Vercel
5. Check Cloudinary for uploaded videos

Need help? Check the files:
- `VIDEO_PERSISTENCE_FIX_SUMMARY.md` - Technical details
- `ISSUE_RESOLVED.md` - User-friendly explanation
- `CODE_CHANGES_SUMMARY.md` - Exact code changes
