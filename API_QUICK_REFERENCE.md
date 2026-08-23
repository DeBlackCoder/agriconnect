# AgriConnect API Quick Reference

## 🔐 Authentication APIs

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123",
  "fullName": "John Farmer",
  "phoneNumber": "0700000000",
  "role": "FARMER"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123"
}
```

### Get Session
```http
GET /api/auth/session
```

### Logout
```http
POST /api/auth/logout
```

---

## 📦 Product APIs

### List Products
```http
GET /api/products?category=vegetables&minPrice=100&maxPrice=1000&organic=true&search=tomato&page=1&limit=12
```

### Create Product (Farmer only)
```http
POST /api/products
Content-Type: application/json

{
  "name": "Fresh Tomatoes",
  "description": "Organic farm-fresh tomatoes",
  "categoryId": "category_id",
  "images": ["base64_image_string"],
  "unit": "kg",
  "pricePerUnit": 500,
  "availableStock": 100,
  "minimumOrder": 5,
  "location": "Nairobi",
  "isOrganic": true
}
```

### Get Product Details
```http
GET /api/products/[productId]
```

### Update Product (Owner only)
```http
PATCH /api/products/[productId]
Content-Type: application/json

{
  "pricePerUnit": 550,
  "availableStock": 80
}
```

### Delete Product (Owner only)
```http
DELETE /api/products/[productId]
```

---

## 💰 Pricing APIs

### Get Market Average
```http
GET /api/pricing/market-average?category=vegetables&location=Nairobi
```

**Response:**
```json
{
  "category": "vegetables",
  "averagePrice": 450,
  "sampleSize": 25,
  "trend": "increasing",
  "priceRange": {
    "min": 300,
    "max": 800
  }
}
```

### Benchmark Product
```http
GET /api/pricing/benchmark?productId=product_id
```

**Response:**
```json
{
  "currentPrice": 500,
  "marketAverage": 450,
  "position": "above_average",
  "percentile": 65,
  "optimalRange": {
    "min": 400,
    "max": 550
  }
}
```

### Get Pricing Suggestions
```http
POST /api/pricing/suggestions
Content-Type: application/json

{
  "productId": "product_id",
  "category": "vegetables",
  "currentPrice": 500,
  "stock": 50,
  "isOrganic": true,
  "location": "Nairobi"
}
```

**Response:**
```json
{
  "suggestedPrice": 520,
  "reasoning": "15% organic premium applied, current stock adequate",
  "marketPosition": "competitive",
  "adjustments": {
    "organicPremium": 75,
    "stockScarcity": 0,
    "locationFactor": 0
  }
}
```

---

## 💳 Payment APIs

### Initialize Payment
```http
POST /api/payments/initialize
Content-Type: application/json

{
  "orderId": "order_id",
  "amount": 5000,
  "email": "buyer@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "TXN_12345678",
  "accessCode": "access_code"
}
```

### Verify Payment
```http
POST /api/payments/verify
Content-Type: application/json

{
  "reference": "TXN_12345678"
}
```

### Get Payment Receipt
```http
GET /api/payments/receipt?paymentId=payment_id
```

### Get Payment History
```http
GET /api/payments/history?page=1&limit=10
```

### Get Payment Methods
```http
GET /api/payments/methods
```

---

## 📋 Order APIs

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 10,
  "deliveryAddress": "123 Main Street, Nairobi",
  "notes": "Please deliver in the morning"
}
```

### List Orders
```http
GET /api/orders?type=placed&status=CONFIRMED
GET /api/orders?type=received&status=SHIPPED
```

**Query Parameters:**
- `type`: "placed" (orders you made) or "received" (orders for your products)
- `status`: PLACED, CONFIRMED, PROCESSING, SHIPPED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, COMPLETED, CANCELLED

### Get Order Details
```http
GET /api/orders/[orderId]
```

### Update Order Status (Simple)
```http
PATCH /api/orders/[orderId]
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

### Update Order Status (With Tracking)
```http
POST /api/orders/update-status
Content-Type: application/json

{
  "orderId": "order_id",
  "status": "SHIPPED",
  "description": "Package has been handed to courier",
  "location": "Nairobi Distribution Center"
}
```

### Fulfill Order (Farmer only)
```http
POST /api/orders/fulfill
Content-Type: application/json

{
  "orderId": "order_id",
  "trackingNumber": "TRK123456789",
  "carrier": "DHL",
  "estimatedDelivery": "2026-08-25",
  "notes": "Fragile items, handle with care"
}
```

### Get Order Tracking
```http
GET /api/orders/tracking?orderId=order_id
```

**Response:**
```json
{
  "order": {
    "orderNumber": "ORD-20260822-001",
    "status": "IN_TRANSIT",
    "totalAmount": 5000
  },
  "tracking": [
    {
      "status": "PLACED",
      "description": "Order placed",
      "timestamp": "2026-08-22T10:00:00Z"
    },
    {
      "status": "CONFIRMED",
      "description": "Order confirmed by seller",
      "timestamp": "2026-08-22T11:00:00Z"
    },
    {
      "status": "SHIPPED",
      "description": "Order shipped with tracking TRK123",
      "location": "Nairobi",
      "timestamp": "2026-08-22T14:00:00Z"
    }
  ],
  "progress": 62,
  "estimatedDelivery": "2026-08-25T12:00:00Z",
  "timeline": {
    "placed": "2026-08-22T10:00:00Z",
    "confirmed": "2026-08-22T11:00:00Z",
    "shipped": "2026-08-22T14:00:00Z",
    "delivered": null
  }
}
```

---

## ⭐ Review APIs

### Create Review
```http
POST /api/reviews
Content-Type: application/json

{
  "productId": "product_id",
  "rating": 5,
  "comment": "Excellent quality products, fresh and organic!"
}
```

### List Reviews
```http
GET /api/reviews?productId=product_id&page=1&limit=10
GET /api/reviews?userId=user_id&page=1&limit=10
```

**Response:**
```json
{
  "reviews": [...],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "ratingDistribution": {
    "5": 30,
    "4": 10,
    "3": 3,
    "2": 1,
    "1": 1
  },
  "averageRating": 4.5
}
```

### Update Review (Own review only)
```http
PATCH /api/reviews/[reviewId]
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review: Good but could be better"
}
```

### Delete Review (Own review or admin)
```http
DELETE /api/reviews/[reviewId]
```

### Mark Review as Helpful
```http
POST /api/reviews/helpful
Content-Type: application/json

{
  "reviewId": "review_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Marked as helpful",
  "helpfulCount": 15,
  "isHelpful": true
}
```

---

## 🏆 Seller Reputation API

### Get Seller Reputation
```http
GET /api/sellers/reputation?sellerId=seller_id
```

**Response:**
```json
{
  "sellerId": "seller_id",
  "sellerName": "John Farmer",
  "trustScore": 85,
  "badge": "Top Rated",
  "reputation": {
    "averageRating": 4.7,
    "totalReviews": 45,
    "ratingDistribution": {
      "5": 30,
      "4": 10,
      "3": 3,
      "2": 1,
      "1": 1
    }
  },
  "performance": {
    "totalOrders": 120,
    "completedOrders": 115,
    "cancelledOrders": 5,
    "fulfillmentRate": 95.8,
    "responseRate": 92.5
  },
  "metrics": {
    "totalProducts": 25,
    "verifiedPurchases": 38,
    "memberSince": "2025-01-15T00:00:00Z"
  }
}
```

---

## 👤 User Profile APIs

### Get Profile
```http
GET /api/users/profile
```

### Update Profile
```http
PATCH /api/users/profile
Content-Type: application/json

{
  "fullName": "John Updated Farmer",
  "phoneNumber": "0711111111",
  "location": "Nairobi, Kenya"
}
```

### Change Password
```http
PATCH /api/users/password
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

---

## 📊 Categories API

### Get All Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "categories": [
    {
      "_id": "cat_id",
      "name": "Vegetables",
      "icon": "🥬",
      "description": "Fresh vegetables"
    },
    {
      "_id": "cat_id_2",
      "name": "Fruits",
      "icon": "🍎",
      "description": "Fresh fruits"
    }
  ]
}
```

---

## 🔔 Common Response Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not logged in
- `403 Forbidden` - No permission
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

---

## 🔑 Authentication

All protected endpoints require authentication. The session cookie is automatically included in requests after login.

**Session Cookie:**
- Name: `session`
- HTTP-only: `true`
- Expires: 7 days from login

---

## 📝 Notes

### Image Upload
- Images must be base64 encoded
- Max 5 images per product
- Max 5MB per image
- Supported formats: PNG, JPG, JPEG, WebP

### Pagination
- Default `page=1`, `limit=10`
- Max `limit=100`

### Filtering
- Multiple filters can be combined
- Case-insensitive search
- Price ranges are inclusive

### Order Status Flow
```
PLACED → CONFIRMED → PROCESSING → SHIPPED → 
IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED → COMPLETED

Cancel at any time before DELIVERED:
ANY_STATUS → CANCELLED
```

### Trust Score Calculation
```
Trust Score = (Rating Score × 40%) + 
              (Fulfillment Rate × 30%) + 
              (Response Rate × 20%) + 
              (Volume Score × 10%)

Rating Score = (Average Rating / 5) × 40
Fulfillment Rate = (Completed Orders / Total Orders) × 30
Response Rate = (24h Confirmations / Total Orders) × 20
Volume Score = min((Completed Orders / 50) × 10, 10)
```

### Seller Badges
- **Elite Seller**: 90+ trust score
- **Top Rated**: 80-89 trust score
- **Trusted Seller**: 70-79 trust score
- **Verified Seller**: 60-69 trust score
- **Active Seller**: 5+ completed orders
- **New Seller**: Default

---

## 🚀 Getting Started

1. Register as FARMER or BUYER
2. Login to get session
3. Farmers: Create products
4. Buyers: Browse and order
5. Complete transactions
6. Leave reviews

**Happy Trading! 🌾**
