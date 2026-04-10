# API Documentation

Base URL (Local): `http://localhost:5000/api`  
Base URL (Production): `https://your-api-domain.com/api`

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789abcdef0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@intechhealthcare.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789abcdef0",
      "name": "Admin User",
      "email": "admin@intechhealthcare.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "name": "Admin User",
    "email": "admin@intechhealthcare.com",
    "role": "admin",
    "isActive": true
  }
}
```

---

### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

---

### Change Password

```http
PUT /api/auth/change-password
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 📦 Product Endpoints

### Get All Products

```http
GET /api/products?status=active&category=Dermatology&page=1&limit=10
```

**Query Parameters:**
- `status` (optional): `active` | `inactive`
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 3,
  "total": 3,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "id": "65a1b2c3d4e5f6789abcdef0",
      "name": "ADAPALENE",
      "genericName": "Adapalene",
      "composition": "Adapalene 0.1% w/w",
      "category": "Dermatology",
      "description": "Topical retinoid for acne treatment",
      "uses": ["Acne vulgaris", "Comedones"],
      "dosage": "Apply once daily",
      "sideEffects": ["Skin irritation"],
      "precautions": ["Avoid sun exposure"],
      "packaging": ["15g tube", "30g tube"],
      "storage": "Store below 25°C",
      "status": "active",
      "createdAt": "2025-12-17T10:00:00.000Z",
      "updatedAt": "2025-12-17T10:00:00.000Z"
    }
  ]
}
```

---

### Get Single Product

```http
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "name": "ADAPALENE",
    ...
  }
}
```

---

### Search Products

```http
GET /api/products/search?q=adapalene
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

---

### Create Product (Admin Only)

```http
POST /api/products
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Request Body:**
```json
{
  "name": "PRODUCT NAME",
  "genericName": "Generic Name",
  "composition": "Active ingredients",
  "category": "Dermatology",
  "description": "Product description",
  "uses": ["Use 1", "Use 2"],
  "dosage": "Dosage instructions",
  "sideEffects": ["Effect 1", "Effect 2"],
  "precautions": ["Precaution 1"],
  "packaging": ["Pack size 1"],
  "storage": "Storage instructions",
  "status": "active"
}
```

---

### Update Product (Admin Only)

```http
PUT /api/products/:id
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Request Body:** Same as create (partial updates allowed)

---

### Delete Product (Admin Only)

```http
DELETE /api/products/:id
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 💬 Inquiry Endpoints

### Submit Inquiry (Contact Form)

```http
POST /api/inquiries
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "ABC Company",
  "subject": "Product Inquiry",
  "message": "I would like more information about your products."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your inquiry. We will get back to you soon!",
  "data": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "new",
    "createdAt": "2025-12-17T10:00:00.000Z"
  }
}
```

---

### Get All Inquiries (Admin Only)

```http
GET /api/inquiries?status=new&priority=high&page=1&limit=20
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Query Parameters:**
- `status`: `new` | `read` | `responded` | `closed`
- `priority`: `low` | `medium` | `high`
- `page`, `limit`: Pagination

---

### Get Single Inquiry (Admin Only)

```http
GET /api/inquiries/:id
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Note:** Automatically marks inquiry as "read"

---

### Update Inquiry (Admin Only)

```http
PUT /api/inquiries/:id
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Request Body:**
```json
{
  "status": "responded",
  "priority": "high",
  "adminNotes": "Responded via email"
}
```

---

### Delete Inquiry (Admin Only)

```http
DELETE /api/inquiries/:id
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 💰 Quote Endpoints

### Submit Quote Request

```http
POST /api/quotes
```

**Request Body:**
```json
{
  "productId": "65a1b2c3d4e5f6789abcdef0",
  "productName": "ADAPALENE",
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "ABC Pharma",
  "quantity": "1000 units",
  "country": "USA",
  "message": "Bulk order inquiry"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quote request submitted successfully. We will contact you soon!",
  "data": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "status": "pending",
    "createdAt": "2025-12-17T10:00:00.000Z"
  }
}
```

---

### Get All Quotes (Admin Only)

```http
GET /api/quotes?status=pending&page=1&limit=20
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### Get Single Quote (Admin Only)

```http
GET /api/quotes/:id
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### Update Quote (Admin Only)

```http
PUT /api/quotes/:id
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Request Body:**
```json
{
  "status": "quoted",
  "quotedPrice": 5000,
  "adminNotes": "Quote sent via email"
}
```

---

### Delete Quote (Admin Only)

```http
DELETE /api/quotes/:id
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Rate Limiting

- **General API:** 100 requests per 15 minutes per IP
- **Auth Routes:** 5 attempts per 15 minutes per IP
- **Form Submissions:** 10 submissions per hour per IP

---

## Postman Collection

Import this into Postman for easy testing:

```json
{
  "info": {
    "name": "Intech Healthcare API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@intechhealthcare.com\",\n  \"password\": \"admin123\"\n}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

---

**API Version:** 1.0.0  
**Last Updated:** December 17, 2025

