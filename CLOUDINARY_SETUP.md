# Cloudinary Setup Guide

## Problem Fixed
Your hosted Vercel deployment was failing because:
1. **Vercel has a read-only file system** - you cannot write files to disk in serverless environments
2. **`public/uploads` was gitignored** - uploaded files weren't being deployed
3. **Solution**: Use Cloudinary for cloud-based image storage

## Setup Instructions

### 1. Install Cloudinary Package
```bash
npm install cloudinary
```

### 2. Create a Free Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. After signing in, go to your Dashboard
4. You'll see your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Add Environment Variables Locally

Add these to your `.env.local` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add these three variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Make sure to add them for **Production**, **Preview**, and **Development** environments

### 5. Deploy to Vercel

After adding the environment variables:
```bash
git add .
git commit -m "Migrate to Cloudinary for image uploads"
git push
```

Vercel will automatically redeploy your project.

## What Changed

### Files Modified:
1. **`src/lib/cloudinary.ts`** (NEW) - Cloudinary configuration
2. **`src/app/api/upload/route.ts`** - Now uploads to Cloudinary instead of file system
3. **`next.config.mjs`** - Added `res.cloudinary.com` to allowed image domains

### How It Works Now:
- Images are uploaded to Cloudinary's cloud storage
- Cloudinary returns a secure URL (e.g., `https://res.cloudinary.com/...`)
- This URL is stored in your database
- Images are served from Cloudinary's CDN (fast & reliable)
- Works perfectly on Vercel and all serverless platforms

## Benefits
✅ Works on Vercel and all serverless platforms
✅ Fast CDN delivery worldwide
✅ Automatic image optimization
✅ Free tier: 25GB storage, 25GB bandwidth/month
✅ No more missing images in production

## Testing
After deployment, try uploading a book cover. It should now work on both local and hosted environments!
