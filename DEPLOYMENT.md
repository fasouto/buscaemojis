# 🚀 BuscaEmojis Deployment Guide

## Vercel (Recommended) - FREE

### Step 1: Prepare Your Repository
1. Push your code to GitHub (if not already done)
2. Ensure `.env.local` is in `.gitignore` (environment variables will be set in Vercel)

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "Import Project" and select your `buscaemojis` repository
3. Vercel will auto-detect it's a Next.js project
4. Click "Deploy" - your site will be live in ~2 minutes!

### Step 3: Configure Environment Variables
1. Go to your project dashboard in Vercel
2. Go to Settings → Environment Variables
3. Add: `NEXT_PUBLIC_BASE_URL` = `https://your-project-name.vercel.app`
4. Redeploy to apply changes

### Step 4: Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add `buscaemojis.es`
3. Configure DNS records as shown by Vercel

---

## Alternative: Cloudflare Pages - FREE

### Step 1: Build Settings
- Build command: `npm run build`
- Build output directory: `.next`
- Framework preset: `Next.js (Static HTML Export)`

### Step 2: Environment Variables
- Add `NEXT_PUBLIC_BASE_URL` in Cloudflare Pages settings

---

## Alternative: Netlify - FREE

### Step 1: Build Settings
- Build command: `npm run build`
- Publish directory: `.next`

### Step 2: Configure netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## Post-Deployment Checklist

✅ Site loads correctly  
✅ Search functionality works  
✅ Emoji pages load (test: `/emoji/cara-llorando-risa`)  
✅ Categories page works  
✅ Terms page accessible  
✅ Custom domain pointing correctly (if used)  

## Performance Notes

- First load: ~101KB (excellent for a full emoji search app)
- API routes are server-rendered for optimal performance
- Global CDN distribution through Vercel
- Automatic image optimization

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test build locally with `npm run build`