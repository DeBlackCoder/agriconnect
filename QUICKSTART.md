# ⚡ Smart Agriconnect - Quick Start

Get up and running in under 10 minutes!

## Prerequisites

✅ Node.js 18+ installed  
✅ PostgreSQL running  
✅ Code editor ready

## 🚀 One-Command Setup

```bash
# Clone, install, and configure
git clone <repo-url> agriconnect2 && cd agriconnect2 && npm install
```

## 📝 Environment Setup

Create `.env.local`:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/agriconnect"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
NEXTAUTH_URL="http://localhost:3000"
```

## 🗄️ Database Setup

```bash
# Create database
createdb agriconnect

# Initialize schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## 🎯 Run Application

```bash
npm run dev
```

Visit: http://localhost:3000

## 🧪 Quick Test

### 1. Register Farmer
- Go to: http://localhost:3000/auth/register?role=farmer
- Fill form → Submit
- You're in! 🎉

### 2. Register Buyer
- Open incognito/new browser
- Go to: http://localhost:3000/auth/register?role=buyer
- Fill form → Submit

### 3. Test API (Optional)

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "role": "FARMER",
    "farmName": "Test Farm",
    "farmLocation": "Test Location"
  }'
```

## 🎨 Optional: Payment Setup

### Paystack (Recommended for Africa)
1. Sign up: https://paystack.com
2. Get test keys from Dashboard
3. Add to `.env.local`:
```env
PAYSTACK_SECRET_KEY="sk_test_xxxxx"
PAYSTACK_PUBLIC_KEY="pk_test_xxxxx"
```

## 📦 Project Structure

```
agriconnect2/
├── app/
│   ├── api/          # Backend APIs
│   ├── auth/         # Login/Register pages
│   └── page.tsx      # Homepage
├── lib/
│   ├── auth.ts       # Auth utilities
│   └── db.ts         # Database connection
├── prisma/
│   └── schema.prisma # Database schema
└── .env.local        # Your secrets
```

## ✨ What's Included?

✅ Multi-role authentication (Farmer/Buyer/Admin)  
✅ Product catalog with images  
✅ Order management system  
✅ Payment processing (ready)  
✅ Reviews and ratings  
✅ Real-time notifications  
✅ Price history tracking  

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma db push       # Update database schema
npx prisma generate      # Regenerate Prisma client

# Code Quality
npm run lint             # Run ESLint
```

## 📊 Database Tools

View your data in real-time:
```bash
npx prisma studio
```
Opens: http://localhost:5555

## 🐛 Troubleshooting

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Database connection error?**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list               # macOS
```

**Module errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. ✅ Create categories for products
2. ✅ Add some test products
3. ✅ Place a test order
4. ✅ Test payment flow
5. ✅ Leave a review

## 🔗 Useful Links

- [Full README](./README.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Technical Docs](./PROJECT_DOCUMENTATION.md)
- [API Reference](./PROJECT_DOCUMENTATION.md#api-documentation)

## 💬 Need Help?

- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
- Review [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for technical details
- Open an issue on GitHub

---

**Happy Coding! 🌾**
