# 📚 Smart Agriconnect - Technical Documentation

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Design](#database-design)
3. [API Documentation](#api-documentation)
4. [Security Implementation](#security-implementation)
5. [Payment Integration](#payment-integration)
6. [Real-Time Features](#real-time-features)
7. [Future Enhancements](#future-enhancements)

---

## System Architecture

### Technology Stack

**Frontend:**
- **Framework**: Next.js 16.3.0 with App Router
- **UI Library**: React 19.2.8
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript 5.x
- **State Management**: React Hooks (useState, useEffect)

**Backend:**
- **Runtime**: Next.js API Routes (Node.js)
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 6.2.0
- **Authentication**: JWT (jose library)
- **Validation**: Zod 3.24.1
- **Password Hashing**: bcryptjs

**Infrastructure:**
- **File Storage**: Cloudinary (configurable)
- **Payment Gateway**: Paystack/Flutterwave
- **Deployment**: Vercel-ready

### Architecture Pattern

```
┌─────────────────────────────────────────────────┐
│            Client Browser (React)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Pages   │  │Components│  │  Hooks   │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────┬───────────────────────────┘
                      │ HTTP/HTTPS
┌─────────────────────▼───────────────────────────┐
│         Next.js Server (API Routes)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Auth   │  │  Products│  │  Orders  │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Payments │  │  Reviews │  │ Utilities│      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────┬───────────────────────────┘
                      │ Prisma ORM
┌─────────────────────▼───────────────────────────┐
│            PostgreSQL Database                   │
│  ┌─────────────────────────────────────┐        │
│  │  Users | Products | Orders | ...    │        │
│  └─────────────────────────────────────┘        │
└──────────────────────────────────────────────────┘
```

---

## Database Design

### Entity Relationship Diagram

```
User (FARMER/BUYER/ADMIN)
│
├─ FarmerProfile (1:1)
│  ├─ farmName
│  ├─ farmLocation
│  └─ rating
│
├─ BuyerProfile (1:1)
│  ├─ businessName
│  └─ totalPurchases
│
├─ Products (1:N) ─────┐
│  ├─ name             │
│  ├─ price            │
│  ├─ stock            ├─ Category (N:1)
│  ├─ images           │
│  └─ isOrganic        │
│                      │
├─ Orders (1:N)        │
│  ├─ orderNumber      │
│  ├─ status           │
│  ├─ totalAmount      │
│  │                   │
│  ├─ OrderItems (1:N)─┘
│  │  ├─ quantity
│  │  └─ priceAtTime
│  │
│  ├─ Payment (1:1)
│  │  ├─ transactionRef
│  │  ├─ status
│  │  └─ amount
│  │
│  └─ OrderTracking (1:N)
│     ├─ status
│     └─ timestamp
│
├─ Reviews (1:N) ──> Products
│  ├─ rating (1-5)
│  ├─ comment
│  └─ isVerified
│
└─ Notifications (1:N)
   ├─ title
   ├─ message
   └─ isRead
```

### Key Database Models

#### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // Hashed with bcrypt
  fullName      String
  role          UserRole  // FARMER | BUYER | ADMIN
  isVerified    Boolean   @default(false)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### Product Model
```prisma
model Product {
  id              String   @id @default(cuid())
  name            String
  description     String
  images          String[] // Array of URLs
  pricePerUnit    Float
  availableStock  Float
  unit            String   // kg, piece, bunch
  isOrganic       Boolean  @default(false)
  views           Int      @default(0)
  isActive        Boolean  @default(true)
}
```

### Database Indexes

Performance-critical indexes:
```prisma
@@index([email])        // Fast user lookup
@@index([role])         // Role-based queries
@@index([isActive])     // Active products filter
@@index([categoryId])   // Category filtering
@@index([orderNumber])  // Order tracking
@@index([transactionRef]) // Payment verification
```

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "password123",
  "fullName": "John Farmer",
  "phoneNumber": "+1234567890",
  "role": "FARMER",
  "farmName": "Green Valley Farm",
  "farmLocation": "Rural Area, State"
}

Response 200:
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "clx...",
    "email": "farmer@example.com",
    "fullName": "John Farmer",
    "role": "FARMER"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "clx...",
    "email": "farmer@example.com",
    "fullName": "John Farmer",
    "role": "FARMER"
  }
}
```

### Product Endpoints

#### List Products
```http
GET /api/products?category=vegetables&search=tomato&minPrice=5&maxPrice=20&organic=true&page=1&limit=20

Response 200:
{
  "products": [
    {
      "id": "clx...",
      "name": "Organic Tomatoes",
      "description": "Fresh organic tomatoes",
      "pricePerUnit": 10.5,
      "unit": "kg",
      "images": ["https://..."],
      "averageRating": 4.5,
      "reviewCount": 12,
      "farmer": {
        "fullName": "John Farmer",
        "farmerProfile": {
          "farmName": "Green Valley Farm",
          "rating": 4.8
        }
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

#### Create Product (Farmer only)
```http
POST /api/products
Content-Type: application/json
Cookie: session=...

{
  "name": "Fresh Tomatoes",
  "description": "Organically grown tomatoes",
  "categoryId": "clx...",
  "images": ["https://cloudinary.com/..."],
  "unit": "kg",
  "pricePerUnit": 10.5,
  "availableStock": 100,
  "minimumOrder": 5,
  "location": "Green Valley Farm",
  "isOrganic": true
}

Response 200:
{
  "success": true,
  "message": "Product created successfully",
  "product": { ... }
}
```

### Order Endpoints

#### Create Order (Buyer only)
```http
POST /api/orders
Content-Type: application/json
Cookie: session=...

{
  "items": [
    {
      "productId": "clx...",
      "quantity": 10
    }
  ],
  "deliveryAddress": "123 Main St, City, State",
  "specialNotes": "Please deliver in the morning"
}

Response 200:
{
  "success": true,
  "message": "Order(s) created successfully",
  "orders": [
    {
      "id": "clx...",
      "orderNumber": "AGC17234567ABCD",
      "totalAmount": 105.0,
      "status": "PENDING"
    }
  ]
}
```

### Payment Endpoints

#### Initialize Payment
```http
POST /api/payments/initialize
Content-Type: application/json
Cookie: session=...

{
  "orderId": "clx...",
  "paymentMethod": "CARD"
}

Response 200:
{
  "success": true,
  "payment": {
    "id": "clx...",
    "transactionRef": "TXN-AGC17234567ABCD-1234567890",
    "authorizationUrl": "https://checkout.paystack.com/...",
    "amount": 105.0
  }
}
```

#### Verify Payment
```http
GET /api/payments/verify?reference=TXN-AGC17234567ABCD-1234567890
Cookie: session=...

Response 200:
{
  "success": true,
  "message": "Payment verified successfully",
  "payment": {
    "status": "COMPLETED",
    "paidAt": "2026-08-13T10:30:00Z"
  }
}
```

---

## Security Implementation

### Authentication Flow

1. **Password Hashing**
```typescript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hashedPassword);
```

2. **JWT Token Generation**
```typescript
import { SignJWT } from 'jose';

const token = await new SignJWT({ user })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('7d')
  .sign(SECRET_KEY);
```

3. **Session Management**
```typescript
// Set HTTP-only cookie
cookies.set('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
});
```

### Input Validation

Using Zod schemas:
```typescript
const productSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  stock: z.number().positive(),
  images: z.array(z.string()).min(1),
});

const validatedData = productSchema.parse(requestBody);
```

### Authorization Checks

```typescript
// Middleware pattern
const session = await getSession();

if (!session || session.role !== 'FARMER') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}

// Resource ownership check
if (product.farmerId !== session.id) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### SQL Injection Prevention

Prisma ORM automatically prevents SQL injection:
```typescript
// Safe - Prisma parameterizes queries
const user = await prisma.user.findUnique({
  where: { email: userInput }
});
```

---

## Payment Integration

### Payment Flow

1. **Order Creation** → Status: PENDING
2. **Payment Initialization** → Generate transaction reference
3. **Redirect to Gateway** → User completes payment
4. **Payment Verification** → Webhook/Callback
5. **Order Confirmation** → Status: CONFIRMED
6. **Notification** → Buyer & Farmer notified

### Paystack Integration Example

```typescript
// Initialize
const response = await fetch('https://api.paystack.co/transaction/initialize', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: user.email,
    amount: totalAmount * 100, // Convert to kobo
    reference: transactionRef,
    callback_url: `${BASE_URL}/payment/verify`,
  }),
});

// Verify
const verification = await fetch(
  `https://api.paystack.co/transaction/verify/${reference}`,
  {
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  }
);
```

---

## Real-Time Features

### Price History Tracking

Automatic price tracking on updates:
```typescript
if (priceChanged) {
  await prisma.priceHistory.create({
    data: {
      productId,
      price: newPrice,
      marketAvg: null, // Updated by pricing engine
    },
  });
}
```

### Notification System

```typescript
await prisma.notification.create({
  data: {
    userId: recipientId,
    title: 'Order Status Updated',
    message: `Your order ${orderNumber} is now ${status}`,
    type: 'order_update',
    link: `/orders/${orderId}`,
  },
});
```

### Order Tracking

```typescript
await prisma.orderTracking.create({
  data: {
    orderId,
    status: 'SHIPPED',
    location: 'Distribution Center',
    description: 'Package dispatched for delivery',
  },
});
```

---

## Future Enhancements

### Phase 2 Features

1. **Real-Time Chat**
   - Buyer-Farmer messaging
   - WebSocket integration
   - File sharing

2. **Advanced Analytics**
   - Sales dashboards
   - Market trends
   - Revenue reports

3. **Mobile Application**
   - React Native app
   - Push notifications
   - Offline support

4. **AI Features**
   - Price recommendation
   - Demand forecasting
   - Crop disease detection

5. **Logistics Integration**
   - Third-party delivery
   - GPS tracking
   - Route optimization

6. **Multi-Language Support**
   - i18n implementation
   - RTL support
   - Currency conversion

7. **Advanced Search**
   - Elasticsearch integration
   - Fuzzy search
   - Filters and facets

### Scalability Considerations

- **Caching**: Redis for session and data caching
- **CDN**: Cloudflare for static assets
- **Database**: Read replicas for scaling
- **Queue**: Bull/BullMQ for background jobs
- **Monitoring**: Sentry for error tracking

---

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Consistent naming conventions
- Comprehensive error handling

### Testing Strategy

```typescript
// Unit tests
describe('Product API', () => {
  it('should create product', async () => {
    // Test implementation
  });
});

// Integration tests
describe('Order Flow', () => {
  it('should complete order flow', async () => {
    // Test implementation
  });
});
```

### Git Workflow

```bash
# Feature branch
git checkout -b feature/payment-integration

# Commit with meaningful messages
git commit -m "feat: add Paystack payment integration"

# Pull request with description
```

---

**Last Updated**: August 13, 2026
**Version**: 1.0.0
**Maintainer**: Development Team
