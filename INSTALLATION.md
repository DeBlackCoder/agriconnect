# 🚀 Smart Agriconnect - Installation & Testing Guide

## Quick Installation (Windows)

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 16.3.0
- React 19.2.8
- Prisma ORM
- bcryptjs (password hashing)
- jose (JWT tokens)
- zod (validation)
- TypeScript
- Tailwind CSS

### Step 2: Set Up Environment Variables

The `.env.local` file has been created. Update it with your credentials:

```env
# Required: PostgreSQL Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/agriconnect"

# Required: Authentication Secret
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Payment Gateway (for production)
PAYSTACK_SECRET_KEY="sk_test_your_key"
PAYSTACK_PUBLIC_KEY="pk_test_your_key"

# Optional: File Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
# Using OpenSSL
openssl rand -hex 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Set Up PostgreSQL Database

#### Install PostgreSQL (if not already installed)

**Using Chocolatey:**
```bash
choco install postgresql
```

**Or download from:** https://www.postgresql.org/download/windows/

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE agriconnect;

# Exit
\q
```

### Step 4: Initialize Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

You should see:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

### Step 5: Start Development Server

```bash
npm run dev
```

Open your browser and visit: **http://localhost:3000**

## Testing the Application

### 1. View the New Hero Section 🎨

Open http://localhost:3000 and you should see:
- ✅ Full-screen animated hero with gradient background
- ✅ Floating blob animations
- ✅ Fixed navigation bar with blur effect
- ✅ Responsive design on all screen sizes
- ✅ Smooth animations and transitions

### 2. Test Responsive Design 📱

#### In Browser DevTools:
1. Press `F12` to open DevTools
2. Click the device toggle icon (or press `Ctrl+Shift+M`)
3. Test different screen sizes:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

#### What to Check:
- Navigation adapts properly
- Hero text scales appropriately
- Buttons stack on mobile
- Stats grid adjusts columns
- All sections remain readable

### 3. Test User Registration 👤

#### Register as Farmer:
1. Click "I'm a Farmer" button in hero
2. Fill in the form:
   - Full Name: John Farmer
   - Email: farmer@test.com
   - Password: password123
   - Farm Name: Green Valley Farm
   - Farm Location: Rural Area
3. Click "Create Account"
4. Should redirect to `/dashboard/farmer`

#### Register as Buyer:
1. Open incognito/private window
2. Navigate to http://localhost:3000/auth/register?role=buyer
3. Fill in the form:
   - Full Name: Jane Buyer
   - Email: buyer@test.com
   - Password: password123
4. Click "Create Account"
5. Should redirect to `/dashboard/buyer`

### 4. Test Authentication API 🔐

#### Using curl:

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"fullName\":\"Test User\",\"role\":\"FARMER\",\"farmName\":\"Test Farm\",\"farmLocation\":\"Test Location\"}"
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Get Session:**
```bash
curl http://localhost:3000/api/auth/session
```

### 5. Inspect Database 🗄️

Open Prisma Studio to view your database:
```bash
npx prisma studio
```

Opens at: http://localhost:5555

You should see:
- User table with registered users
- FarmerProfile or BuyerProfile tables
- Empty Product, Order, Payment tables (ready for use)

## Common Issues & Solutions

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001

# Or kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue: "Database connection failed"

**Solution:**
1. Check PostgreSQL is running:
   ```bash
   # Check service status (run as admin)
   sc query postgresql-x64-14
   ```

2. Verify DATABASE_URL in `.env.local`
3. Test connection:
   ```bash
   psql -U postgres -d agriconnect
   ```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear cache and reinstall
del /s /q node_modules
del package-lock.json
npm install
```

### Issue: Prisma errors

**Solution:**
```bash
# Reset and regenerate
npx prisma generate
npx prisma db push --force-reset
```

### Issue: Animations not working

**Solution:**
1. Clear browser cache (`Ctrl+Shift+Delete`)
2. Hard refresh (`Ctrl+F5`)
3. Check browser console for errors

## Performance Testing

### Lighthouse Audit
1. Open Chrome DevTools (`F12`)
2. Go to "Lighthouse" tab
3. Select "Desktop" or "Mobile"
4. Click "Analyze page load"

**Expected Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Check Animations
- Hero animations should be smooth (60fps)
- No jank or stuttering
- Blob animations should flow smoothly
- Hover effects should be instant

## Feature Checklist

After installation, verify these features work:

### Authentication System ✅
- [x] User registration (Farmer/Buyer)
- [x] User login
- [x] Session management
- [x] Role-based access
- [x] Secure password hashing

### UI/UX ✅
- [x] Full-screen responsive hero
- [x] Animated background blobs
- [x] Smooth scroll animations
- [x] Fixed navigation bar
- [x] Responsive design (mobile/tablet/desktop)
- [x] Custom scrollbar
- [x] Hover effects and transitions

### API Endpoints ✅
- [x] POST /api/auth/register
- [x] POST /api/auth/login
- [x] POST /api/auth/logout
- [x] GET /api/auth/session
- [x] Product APIs (ready)
- [x] Order APIs (ready)
- [x] Payment APIs (ready)
- [x] Review APIs (ready)

### Database Schema ✅
- [x] User model with roles
- [x] FarmerProfile model
- [x] BuyerProfile model
- [x] Product model
- [x] Order & OrderItem models
- [x] Payment model
- [x] Review model
- [x] Notification model

## Next Steps

### 1. Add Categories
Create product categories:
```bash
# Open Prisma Studio
npx prisma studio

# Add categories manually or create a seed script
```

### 2. Test Product Creation
Once logged in as a farmer, test creating products (dashboard to be built).

### 3. Configure Payment Gateway
Sign up for Paystack or Flutterwave and add keys to `.env.local`.

### 4. Deploy to Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Update database schema
npx prisma db seed       # Run seed script

# Code Quality
npm run lint             # Run ESLint

# Clear Everything
rd /s /q node_modules    # Remove node_modules
rd /s /q .next           # Remove Next.js cache
del package-lock.json    # Remove lock file
npm install              # Fresh install
```

## Getting Help

### Documentation
- [README.md](./README.md) - Project overview
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
- [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) - Technical docs
- [UI_IMPROVEMENTS.md](./UI_IMPROVEMENTS.md) - UI changes
- [QUICKSTART.md](./QUICKSTART.md) - Quick reference

### Check Logs
- Browser Console (`F12` → Console)
- Terminal output (where `npm run dev` is running)
- Network tab (for API requests)

### Common Commands
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check installed packages
npm list --depth=0

# Check for updates
npm outdated
```

## Success Indicators

Your installation is successful if:

✅ Server starts without errors
✅ Homepage loads at http://localhost:3000
✅ Hero section displays with animations
✅ Navigation is fixed and responsive
✅ Registration works for both roles
✅ Login redirects to appropriate dashboard
✅ Database shows registered users in Prisma Studio
✅ All animations are smooth
✅ Responsive on mobile/tablet/desktop

---

**Congratulations! 🎉 Smart Agriconnect is now running!**

Start building your agricultural marketplace by adding products, testing orders, and integrating payment gateways.
