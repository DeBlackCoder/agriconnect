# 🌾 Smart Agriconnect - Digital Agricultural Marketplace

A comprehensive digital marketplace platform connecting farmers directly with buyers, eliminating intermediaries, ensuring fair pricing, and promoting transparent agricultural trade.

## 🎯 Project Overview

Smart Agriconnect addresses critical challenges faced by farmers in agricultural communities:
- Limited access to markets
- Price exploitation by intermediaries
- Lack of transparency in sales transactions
- Inefficient communication between farmers and buyers
- Unreliable payment systems

## ✨ Core Features

### 1. **Multi-Role User Authentication System**
- Secure registration and login for Farmers, Buyers, and Administrators
- Role-based access control with JWT authentication
- Profile management for each user type
- Session management with secure cookies

### 2. **Dynamic Product Catalog Management**
- Farmers can list agricultural products with detailed information
- Multiple image upload support
- Real-time inventory management
- Price setting and stock updates
- Product categorization
- Harvest date tracking
- Organic certification flagging

### 3. **Real-Time Pricing Engine**
- Historical price tracking for transparency
- Market data aggregation
- Price benchmarks for farmers
- Transparent price negotiation
- Price history visualization

### 4. **Secure Payment Processing**
- Multiple payment methods (Card, Bank Transfer, Mobile Money)
- Payment gateway integration (Paystack/Flutterwave ready)
- Encrypted transaction data
- Verifiable payment records
- Automated payment notifications

### 5. **Order Management & Tracking**
- Comprehensive order placement system
- Real-time order status tracking
- Delivery management
- Order history and analytics
- Automated notifications for order updates
- Multi-item orders with stock validation

### 6. **Ratings & Feedback System**
- Product reviews and ratings (1-5 stars)
- Verified purchase reviews
- Farmer reputation system
- Rating aggregation and display
- Trust-building through transparency

## 🛠️ Technology Stack

- **Frontend**: Next.js 16.3.0 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Server-side)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with jose, bcryptjs
- **Validation**: Zod schema validation
- **File Upload**: Cloudinary (configurable)
- **Payment**: Paystack/Flutterwave integration ready

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** (v14 or higher)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd agriconnect2
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
# Using PostgreSQL CLI
createdb agriconnect
```

### 4. Configure Environment Variables

Copy the `.env.local` file and update with your credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/agriconnect"

# Authentication
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# File Upload (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Payment Gateway (Paystack)
PAYSTACK_SECRET_KEY="your-paystack-secret-key"
PAYSTACK_PUBLIC_KEY="your-paystack-public-key"
```

### 5. Initialize Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed initial data
npx prisma db seed
```

### 6. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
agriconnect2/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   └── session/
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   ├── payments/       # Payment processing
│   │   └── reviews/        # Review and rating system
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # User dashboards (to be created)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx           # Homepage
├── lib/
│   ├── auth.ts            # Authentication utilities
│   └── db.ts              # Database connection
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets
├── .env.local            # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Products
- `GET /api/products` - List all products (with filters)
- `POST /api/products` - Create product (Farmer only)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (Farmer only)
- `DELETE /api/products/[id]` - Delete product (Farmer only)

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order (Buyer only)
- `GET /api/orders/[id]` - Get order details
- `PATCH /api/orders/[id]` - Update order status (Farmer/Admin)

### Payments
- `POST /api/payments/initialize` - Initialize payment
- `GET /api/payments/verify?reference=xxx` - Verify payment

### Reviews
- `GET /api/reviews?productId=xxx` - Get product reviews
- `POST /api/reviews` - Create review (Buyer only)

## 👥 User Roles

### 🌾 Farmer
- Create and manage product listings
- Set prices and manage inventory
- View and fulfill orders
- Track sales analytics
- Receive payments securely

### 🛒 Buyer
- Browse product catalog
- Place orders
- Make secure payments
- Track order delivery
- Leave reviews and ratings

### 👨‍💼 Admin
- Manage all users
- Monitor platform activity
- Resolve disputes
- Generate reports
- System configuration

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- HTTP-only secure cookies
- Role-based access control (RBAC)
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS protection

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Database Schema

The application uses Prisma ORM with the following main models:
- **User** - User accounts with role-based profiles
- **FarmerProfile** - Farmer-specific information
- **BuyerProfile** - Buyer-specific information
- **Product** - Agricultural products
- **Category** - Product categories
- **Order** - Purchase orders
- **OrderItem** - Individual order items
- **Payment** - Payment transactions
- **OrderTracking** - Order status tracking
- **Review** - Product reviews and ratings
- **PriceHistory** - Historical pricing data
- **Notification** - User notifications

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
npm run build
npm run start
```

### Database Hosting

Recommended PostgreSQL hosting options:
- **Neon** (Serverless PostgreSQL)
- **Supabase**
- **Railway**
- **Render**

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built to empower farmers and promote digital transformation in agriculture
- Designed to eliminate intermediaries and ensure fair pricing
- Focused on transparency, security, and user trust

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact the development team

---

**Smart Agriconnect** - Connecting Farmers Directly with Buyers 🌾
#   a g r i c o n n e c t  
 