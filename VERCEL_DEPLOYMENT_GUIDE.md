# Vercel Deployment Guide for AgriConnect

## 🚀 Quick Deployment Steps

### 1. Push to GitHub (if not already done)
```bash
git add .
git commit -m "feat: complete AgriConnect marketplace with all 6 features"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Configure Environment Variables
Add these in Vercel Project Settings → Environment Variables:

```env
MONGODB_URI=mongodb://hillaryprosperwahua_db_user:8DkSf2K99f8r8d4a@ac-6dtfmhz-shard-00-00.0l4wwao.mongodb.net:27017,ac-6dtfmhz-shard-00-01.0l4wwao.mongodb.net:27017,ac-6dtfmhz-shard-00-02.0l4wwao.mongodb.net:27017/agriconnect?ssl=true&replicaSet=atlas-eg3nv2-shard-0&authSource=admin&appName=Cluster0

NEXTAUTH_SECRET=your-production-secret-key-here-change-this

NEXTAUTH_URL=https://your-app-name.vercel.app

PAYSTACK_SECRET_KEY=your-paystack-secret-key

PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

**⚠️ IMPORTANT:** Generate a new secure NEXTAUTH_SECRET for production:
```bash
openssl rand -base64 32
```

### 4. Deploy
Click "Deploy" and wait for build to complete.

---

## 🔧 Troubleshooting Stuck Deployment

### Issue: Build Timeout or Stuck at "Creating optimized production build"

#### Solution 1: Increase Build Memory (Vercel Pro)
If you have Vercel Pro, you can increase memory:
- Go to Project Settings → Functions
- Increase memory limit to 3008 MB

#### Solution 2: Optimize Build Configuration
The project now includes these optimizations in `next.config.ts`:
- Package import optimization for lucide-react
- ESLint skipped during builds
- TypeScript type checking optimized

#### Solution 3: Check for Circular Dependencies
Run locally to identify issues:
```bash
npm run build
```

If it times out locally, check for:
- Circular imports between files
- Heavy computations in module scope
- Large data imports

#### Solution 4: Reduce Build Size
Already configured in `.vercelignore`:
- Documentation files excluded
- Test files excluded
- Development files excluded
- Local environment files excluded

#### Solution 5: Use Turbopack (Next.js 15+)
Update build command in `package.json`:
```json
{
  "scripts": {
    "build": "next build --turbo"
  }
}
```

#### Solution 6: Split Large Pages
If specific pages are too large, consider:
- Dynamic imports for heavy components
- Code splitting for large libraries
- Lazy loading for non-critical features

---

## 🐛 Common Vercel Deployment Issues

### 1. MongoDB Connection Errors
**Error:** `MongoServerError: Authentication failed`

**Solution:**
- Verify MongoDB connection string is correct
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for Vercel)
- Ensure database user has correct permissions

### 2. Environment Variables Not Working
**Error:** `undefined` when accessing env vars

**Solution:**
- Environment variables must be prefixed with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding env vars
- Check variable names match exactly (case-sensitive)

### 3. Build Fails with TypeScript Errors
**Error:** `Type error: ...`

**Solution:**
- Run `npm run build` locally first
- Fix all TypeScript errors
- Or temporarily set `typescript.ignoreBuildErrors: true` in next.config.ts

### 4. Module Not Found Errors
**Error:** `Module not found: Can't resolve '@/...'`

**Solution:**
- Check `tsconfig.json` has correct paths configuration
- Ensure all imports use correct casing (case-sensitive)
- Verify all imported files exist

### 5. Image Optimization Errors
**Error:** `Invalid src prop`

**Solution:**
- Check `next.config.ts` has correct image domains
- Use proper Image component from next/image
- Verify image URLs are accessible

### 6. API Routes Not Working
**Error:** `404 on API routes`

**Solution:**
- Ensure API routes are in `app/api/` directory
- Check route.ts files export proper HTTP methods
- Verify dynamic route syntax: `[id]/route.ts`

---

## ⚡ Performance Optimization Tips

### 1. Enable Edge Runtime (Where Possible)
Add to API routes:
```typescript
export const runtime = 'edge';
```

### 2. Use Static Generation
For pages that don't need dynamic data:
```typescript
export const dynamic = 'force-static';
```

### 3. Implement Caching
Already configured in React Query provider:
- 5-minute stale time
- 10-minute cache time
- Smart refetching disabled

### 4. Optimize Images
- Use WebP format
- Compress images before upload
- Implement lazy loading

### 5. Database Indexing
Ensure MongoDB indexes are created:
```bash
npm run seed  # Creates indexes automatically
```

---

## 📊 Monitoring Deployment

### Check Build Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Select "Deployments"
4. Click on the running deployment
5. View "Building" logs

### Common Log Patterns to Watch:

**Normal Build:**
```
Creating an optimized production build ...
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (X/X)
✓ Finalizing page optimization
```

**Stuck Build:**
```
Creating an optimized production build ...
[No progress for 5+ minutes]
```

**Failed Build:**
```
Error: Command "next build" exited with 1
```

---

## 🔄 Alternative Deployment Methods

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] Test authentication (login/register)
- [ ] Test product creation and listing
- [ ] Verify pricing engine calculations
- [ ] Test payment initialization
- [ ] Check order creation and tracking
- [ ] Test review system
- [ ] Verify all API endpoints work
- [ ] Check MongoDB connection
- [ ] Test responsive design on mobile
- [ ] Verify environment variables loaded
- [ ] Check console for errors
- [ ] Test all navigation links
- [ ] Verify images load correctly
- [ ] Test form submissions
- [ ] Check error handling

---

## 🆘 Still Having Issues?

### Check Vercel Status
Visit: https://www.vercel-status.com/

### Vercel Support
- Community: https://github.com/vercel/vercel/discussions
- Twitter: @vercel
- Email: support@vercel.com (Pro/Enterprise only)

### Debug Locally First
Always test build locally before deploying:
```bash
npm run build
npm run start
```

If it works locally but not on Vercel, the issue is likely:
- Environment variables
- Build configuration
- Memory/timeout limits
- External service connectivity

---

## 📝 Build Configuration Summary

**Current Optimizations:**
- ✅ ESLint skipped during builds
- ✅ Lucide-react package optimizations
- ✅ Documentation files excluded
- ✅ Incremental TypeScript compilation
- ✅ React Query caching configured
- ✅ Image optimization configured
- ✅ MongoDB indexes created

**Build Time Expectations:**
- Small projects: 1-3 minutes
- Medium projects (like AgriConnect): 3-7 minutes
- Large projects: 7-15 minutes

If build exceeds 15 minutes, something is wrong.

---

## 🎉 Success!

Once deployed successfully:
- Your app will be at: `https://your-app-name.vercel.app`
- Automatic HTTPS enabled
- Global CDN distribution
- Automatic deployments on git push
- Preview deployments for PRs

**Next Steps:**
1. Set up custom domain (optional)
2. Configure analytics
3. Set up error monitoring (Sentry)
4. Enable Web Vitals tracking
5. Set up database backups

---

**Happy Deploying! 🚀**
