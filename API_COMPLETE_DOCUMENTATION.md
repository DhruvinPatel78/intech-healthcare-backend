# 📘 InTech Healthcare API - Complete Documentation

Complete REST API documentation for InTech Healthcare backend.

**Base URL:** `https://intech-healthcare-backend.vercel.app/api`
**Version:** 1.0.0

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Products API](#products-api)
3. [Inquiries API](#inquiries-api)
4. [Quotes API](#quotes-api)
5. [Response Format](#response-format)
6. [Error Codes](#error-codes)
7. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

### Register User

**Endpoint:** `POST /api/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "manager"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "manager"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login User

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "intechhealthcare@gmail.com",
  "password": "Intech@Admin"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Intech Admin",
      "email": "intechhealthcare@gmail.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

**Endpoint:** `GET /api/auth/me`

**Access:** Protected (Requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Intech Admin",
    "email": "intechhealthcare@gmail.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Profile

**Endpoint:** `PUT /api/auth/profile`

**Access:** Protected

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "role": "manager"
  }
}
```

---

### Change Password

**Endpoint:** `PUT /api/auth/change-password`

**Access:** Protected

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## 💊 Products API

### Get All Products

**Endpoint:** `GET /api/products`

**Access:** Public

**Query Parameters:**
- `status` (optional): Filter by status (`active`, `inactive`)
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```
GET /api/products?status=active&category=Dermatology&page=1&limit=10
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Adapalene Gel",
      "genericName": "Adapalene",
      "composition": "Adapalene 0.1% w/w",
      "category": "Dermatology",
      "description": "Topical gel for acne treatment",
      "uses": [
        "Acne vulgaris",
        "Comedonal acne"
      ],
      "dosage": "Apply once daily before bedtime",
      "sideEffects": [
        "Skin irritation",
        "Dryness",
        "Redness"
      ],
      "precautions": [
        "Avoid contact with eyes",
        "Use sunscreen during day"
      ],
      "packaging": ["15g tube", "30g tube"],
      "storage": "Store at room temperature",
      "imageUrl": "https://res.cloudinary.com/demo/image/upload/v1234/intech-healthcare/products/adapalene.jpg",
      "imagePublicId": "intech-healthcare/products/adapalene",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Product

**Endpoint:** `GET /api/products/:id`

**Access:** Public

**Example Request:**
```
GET /api/products/64a1b2c3d4e5f6g7h8i9j0k1
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Adapalene Gel",
    "genericName": "Adapalene",
    "composition": "Adapalene 0.1% w/w",
    "category": "Dermatology",
    "description": "Topical gel for acne treatment",
    "uses": ["Acne vulgaris", "Comedonal acne"],
    "dosage": "Apply once daily before bedtime",
    "sideEffects": ["Skin irritation", "Dryness", "Redness"],
    "precautions": ["Avoid contact with eyes", "Use sunscreen during day"],
    "packaging": ["15g tube", "30g tube"],
    "storage": "Store at room temperature",
    "imageUrl": "https://res.cloudinary.com/...",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### Search Products

**Endpoint:** `GET /api/products/search`

**Access:** Public

**Query Parameters:**
- `q` (required): Search query

**Example Request:**
```
GET /api/products/search?q=acne
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Adapalene Gel",
      "genericName": "Adapalene",
      "category": "Dermatology",
      "description": "Topical gel for acne treatment",
      "imageUrl": "https://res.cloudinary.com/...",
      "status": "active"
    }
  ]
}
```

---

### Create Product (with Image)

**Endpoint:** `POST /api/products`

**Access:** Protected (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
name: Adapalene Gel
genericName: Adapalene
composition: Adapalene 0.1% w/w
category: Dermatology
description: Topical gel for acne treatment
uses: ["Acne vulgaris", "Comedonal acne"]
dosage: Apply once daily before bedtime
sideEffects: ["Skin irritation", "Dryness"]
precautions: ["Avoid contact with eyes"]
packaging: ["15g tube", "30g tube"]
storage: Store at room temperature
image: [File] (max 5MB, JPG/PNG/GIF/WebP)
status: active
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('name', 'Adapalene Gel');
formData.append('genericName', 'Adapalene');
formData.append('composition', 'Adapalene 0.1% w/w');
formData.append('category', 'Dermatology');
formData.append('description', 'Topical gel for acne treatment');
formData.append('uses', JSON.stringify(['Acne vulgaris', 'Comedonal acne']));
formData.append('dosage', 'Apply once daily before bedtime');
formData.append('sideEffects', JSON.stringify(['Skin irritation', 'Dryness']));
formData.append('precautions', JSON.stringify(['Avoid contact with eyes']));
formData.append('packaging', JSON.stringify(['15g tube', '30g tube']));
formData.append('storage', 'Store at room temperature');
formData.append('image', imageFile);
formData.append('status', 'active');

const response = await fetch('https://intech-healthcare-backend.vercel.app/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Adapalene Gel",
    "imageUrl": "https://res.cloudinary.com/...",
    "imagePublicId": "intech-healthcare/products/xyz123",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Product

**Endpoint:** `PUT /api/products/:id`

**Access:** Protected (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:** (same as Create, all fields optional)

**Note:** If new image is uploaded, old image is automatically deleted from Cloudinary.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Adapalene Gel Updated",
    "imageUrl": "https://res.cloudinary.com/...",
    "updatedAt": "2024-01-16T15:45:00.000Z"
  }
}
```

---

### Delete Product

**Endpoint:** `DELETE /api/products/:id`

**Access:** Protected (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Note:** Associated image is automatically deleted from Cloudinary.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 📧 Inquiries API (Contact Form)

### Get All Inquiries

**Endpoint:** `GET /api/inquiries`

**Access:** Protected (Admin only)

**Query Parameters:**
- `status` (optional): `new`, `read`, `responded`, `closed`
- `priority` (optional): `low`, `medium`, `high`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 15,
  "total": 45,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "company": "ABC Pharma",
      "subject": "Product Information Request",
      "message": "I would like to know more about your dermatology products...",
      "status": "new",
      "priority": "medium",
      "adminNotes": null,
      "respondedAt": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Inquiry

**Endpoint:** `GET /api/inquiries/:id`

**Access:** Protected (Admin only)

**Note:** Automatically marks inquiry as "read" if status is "new"

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "ABC Pharma",
    "subject": "Product Information Request",
    "message": "I would like to know more about your dermatology products...",
    "status": "read",
    "priority": "medium",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Create Inquiry (Submit Contact Form)

**Endpoint:** `POST /api/inquiries`

**Access:** Public

**Rate Limit:** 10 requests per hour per IP

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "ABC Pharma",
  "subject": "Product Information Request",
  "message": "I would like to know more about your dermatology products..."
}
```

**Required Fields:** `name`, `email`, `subject`, `message`

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Thank you for your inquiry. We will get back to you soon!",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "new",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Note:** Sends automatic email notification to admin.

---

### Update Inquiry

**Endpoint:** `PUT /api/inquiries/:id`

**Access:** Protected (Admin only)

**Request Body:**
```json
{
  "status": "responded",
  "priority": "high",
  "adminNotes": "Sent product catalog via email"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Inquiry updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "status": "responded",
    "priority": "high",
    "adminNotes": "Sent product catalog via email",
    "respondedAt": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### Delete Inquiry

**Endpoint:** `DELETE /api/inquiries/:id`

**Access:** Protected (Admin only)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Inquiry deleted successfully"
}
```

---

## 💰 Quotes API

### Get All Quotes

**Endpoint:** `GET /api/quotes`

**Access:** Protected (Admin only)

**Query Parameters:**
- `status` (optional): `pending`, `quoted`, `approved`, `rejected`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 10,
  "total": 30,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "productId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Adapalene Gel",
        "composition": "Adapalene 0.1% w/w"
      },
      "productName": "Adapalene Gel",
      "customerName": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+1987654321",
      "company": "XYZ Distributors",
      "quantity": "1000 units",
      "country": "United States",
      "message": "Looking for bulk pricing",
      "status": "pending",
      "quotedPrice": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Quote

**Endpoint:** `GET /api/quotes/:id`

**Access:** Protected (Admin only)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "productId": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Adapalene Gel",
      "composition": "Adapalene 0.1% w/w"
    },
    "productName": "Adapalene Gel",
    "customerName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1987654321",
    "company": "XYZ Distributors",
    "quantity": "1000 units",
    "country": "United States",
    "message": "Looking for bulk pricing",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Create Quote Request

**Endpoint:** `POST /api/quotes`

**Access:** Public

**Rate Limit:** 10 requests per hour per IP

**Request Body:**
```json
{
  "productId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "productName": "Adapalene Gel",
  "customerName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1987654321",
  "company": "XYZ Distributors",
  "quantity": "1000 units",
  "country": "United States",
  "message": "Looking for bulk pricing"
}
```

**Required Fields:** `productId`, `productName`, `customerName`, `email`, `phone`, `quantity`, `country`

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Quote request submitted successfully. We will contact you soon!",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "productName": "Adapalene Gel",
    "customerName": "Jane Smith",
    "email": "jane@example.com",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Note:** Sends automatic email notification to admin.

---

### Update Quote

**Endpoint:** `PUT /api/quotes/:id`

**Access:** Protected (Admin only)

**Request Body:**
```json
{
  "status": "quoted",
  "quotedPrice": 15000,
  "adminNotes": "Bulk discount applied"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Quote updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "status": "quoted",
    "quotedPrice": 15000,
    "adminNotes": "Bulk discount applied",
    "quotedAt": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### Delete Quote

**Endpoint:** `DELETE /api/quotes/:id`

**Access:** Protected (Admin only)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Quote deleted successfully"
}
```

---

## 📤 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10,
  "data": [ ... ]
}
```

---

## ⚠️ Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

---

## 🚦 Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Authentication | 5 attempts | 15 minutes |
| Contact/Quote Forms | 10 submissions | 1 hour |

**Rate Limit Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1642345678
```

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## 🔒 Security

1. **Authentication:** JWT tokens (7-day expiry)
2. **Authorization:** Role-based access control (admin/manager)
3. **CORS:** Configured for specific domains
4. **Rate Limiting:** Protection against abuse
5. **Helmet:** Security headers enabled
6. **Input Validation:** Server-side validation on all endpoints
7. **Password Hashing:** bcrypt with salt rounds

---

## 📱 Example Usage

### Complete Product Creation Flow (React/JavaScript)

```javascript
// 1. Login
const loginResponse = await fetch('https://intech-healthcare-backend.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'intechhealthcare@gmail.com',
    password: 'Intech@Admin'
  })
});

const { data: { token } } = await loginResponse.json();

// 2. Create product with image
const formData = new FormData();
formData.append('name', 'New Product');
formData.append('genericName', 'Generic Name');
formData.append('composition', 'Chemical composition');
formData.append('category', 'Dermatology');
formData.append('description', 'Product description');
formData.append('dosage', 'Dosage information');
formData.append('storage', 'Storage instructions');
formData.append('image', imageFile);

const createResponse = await fetch('https://intech-healthcare-backend.vercel.app/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await createResponse.json();
console.log(result); // Product created with Cloudinary image URL
```

---

## 🎉 That's It!

You now have complete documentation for the InTech Healthcare API.

For setup instructions, see **SETUP_GUIDE.md**

**Happy Coding!** 🚀

