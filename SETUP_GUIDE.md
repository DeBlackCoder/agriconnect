# 📘 Smart Agriconnect - Setup Guide

This guide will walk you through setting up the Smart Agriconnect platform from scratch.

## 🎯 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm/yarn/pnpm installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Postman or similar (for API testing)

## 📦 Step-by-Step Setup

### Step 1: Install Node.js

If you don't have Node.js installed:

**Windows:**
```bash
# Download from https://nodejs.org/
# Or use winget
winget install OpenJS.NodeJS
```

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use chocolatey
choco install postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 3: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE agriconnect;

# Create user (optional)
CREATE USER agriconnect_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE agriconnect TO agriconnect_user;

# Exit
\q
```

### Step 4: Clone and Install Project

```bash
# Clone repository
git clone <repository-url>
cd agriconnect2

# Install dependencies
npm install
```

### Step 5: Configure Environment

Create `.env.local` in the project root:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/agriconnect"

# Authentication
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Payment Gateway (Paystack)
PAYSTACK_SECRET_KEY="sk_test_your_test_key"
PAYSTACK_PUBLIC_KEY="pk_test_your_test_key"

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 6: Set Up Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# View database in Prisma Studio (optional)
npx prisma studio
```

### Step 7: Verify Setup

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` - you should see the Smart Agriconnect homepage.

## 🧪 Testing the Setup

### Test 1: User Registration

1. Navigate to `http://localhost:3000/auth/register`
2. Select "Farmer" or "Buyer"
3. Fill in the registration form
4. Submit and verify redirect to dashboard

### Test 2: API Endpoints

Use Postman or curl:

```bash
# Register a farmer
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "password123",
    "fullName": "John Farmer",
    "role": "FARMER",
    "farmName": "Green Valley Farm",
    "farmLocation": "Rural Area"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "password123"
  }'

# Get session
curl http://localhost:3000/api/auth/session
```

## 🎨 Setting Up Payment Gateway

### Paystack Setup

1. Sign up at [https://paystack.com](https://paystack.com)
2. Navigate to Settings > API Keys & Webhooks
3. Copy Test Secret Key and Public Key
4. Add to `.env.local`

### Flutterwave Alternative

```env
# Replace Paystack with Flutterwave
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-xxxxx"
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-xxxxx"
```

## 📤 Setting Up File Upload

### Cloudinary Setup

1. Sign up at [https://cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `.env.local`

### Alternative: Local Storage

For development, you can use local file storage:

```typescript
// Create lib/upload.ts
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
}
```

## 🚀 Optional: Seed Database

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const vegetables = await prisma.category.create({
    data: { name: 'Vegetables', description: 'Fresh vegetables' },
  });

  const fruits = await prisma.category.create({
    data: { name: 'Fruits', description: 'Fresh fruits' },
  });

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@agriconnect.com',
      password: await hashPassword('admin123'),
      fullName: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
npx ts-node prisma/seed.ts
```

## 🔧 Troubleshooting

### Database Connection Errors

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Test connection
psql -U postgres -d agriconnect
```

### Port Already in Use

```bash
# Change Next.js port
npm run dev -- -p 3001
```

### Prisma Issues

```bash
# Reset Prisma
npx prisma migrate reset
npx prisma generate
npx prisma db push
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Next Steps

After setup is complete:

1. ✅ Create test users (Farmer and Buyer)
2. ✅ Test product creation
3. ✅ Test order placement
4. ✅ Test payment flow
5. ✅ Review API responses
6. ✅ Check database entries in Prisma Studio

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Paystack API Docs](https://paystack.com/docs/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 💡 Development Tips

1. Use Prisma Studio to inspect database: `npx prisma studio`
2. Check API logs in terminal
3. Use browser DevTools Network tab
4. Enable TypeScript strict mode
5. Write tests as you build

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change NEXTAUTH_SECRET to strong random value
- [ ] Use production Paystack keys
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Enable database backups
- [ ] Set up monitoring

---

**Need Help?** Open an issue on GitHub or contact the development team.
