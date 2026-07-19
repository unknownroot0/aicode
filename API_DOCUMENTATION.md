# Diceymio API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details"
}
```

---

## Authentication Endpoints

### Signup

Create a new user account.

**Request**

```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Signup successful"
}
```

**Validation Rules**

- Email: Valid email format, unique in database
- Password: Minimum 8 characters, 1 uppercase, 1 number
- firstName, lastName: Minimum 2 characters

---

### Login

Authenticate an existing user.

**Request**

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

**Error (401)**

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

## Product Endpoints

### List Products

Get all active products.

**Request**

```
GET /products
```

**Response (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": "catan",
      "name": "Catan",
      "description": "Trade, build, and settle...",
      "price": 45.99,
      "image": null,
      "stock": 5,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    ...
  ]
}
```

---

### Get Product Details

Get specific product information.

**Request**

```
GET /products/:id
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "catan",
    "name": "Catan",
    "description": "Trade, build, and settle...",
    "price": 45.99,
    "image": null,
    "stock": 5,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error (404)**

```json
{
  "success": false,
  "error": "Product not found"
}
```

---

## Shopping Cart Endpoints

### Get Cart

Retrieve the user's shopping cart.

**Request**

```
GET /cart
Authorization: Bearer <token>
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "cart_id",
    "userId": "user_id",
    "items": [
      {
        "id": "item_id",
        "cartId": "cart_id",
        "productId": "catan",
        "product": {
          "id": "catan",
          "name": "Catan",
          "price": 45.99,
          ...
        },
        "quantity": 2,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Add Item to Cart

Add a product to the user's cart.

**Request**

```
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "catan",
  "quantity": 1
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "id": "item_id",
    "cartId": "cart_id",
    "productId": "catan",
    "product": { ... },
    "quantity": 1,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Item added to cart successfully"
}
```

**Errors**

- `404`: Product not found
- `400`: Insufficient stock

---

### Update Cart Item

Update quantity of a cart item.

**Request**

```
PUT /cart/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "item_id",
    "quantity": 2,
    ...
  },
  "message": "Cart item updated successfully"
}
```

---

### Remove Item from Cart

Delete an item from the cart.

**Request**

```
DELETE /cart/items/:id
Authorization: Bearer <token>
```

**Response (204)**

```
No content
```

---

## Order Endpoints

### Create Order

Create a new order from the shopping cart.

**Request**

```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddressId": "address_id",
  "notes": "Please deliver after 5pm"
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "orderNumber": "ORD-1704067200000-ABC123XYZ",
    "userId": "user_id",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "totalAmount": 91.98,
    "shippingAddressId": "address_id",
    "notes": "Please deliver after 5pm",
    "items": [
      {
        "id": "order_item_id",
        "productId": "catan",
        "product": { ... },
        "quantity": 2,
        "price": 45.99
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Order created successfully"
}
```

**Errors**

- `400`: Cart is empty
- `404`: Shipping address not found

---

### Get User Orders

Retrieve all orders for the logged-in user.

**Request**

```
GET /orders
Authorization: Bearer <token>
```

**Response (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": "order_id",
      "orderNumber": "ORD-1704067200000-ABC123XYZ",
      "status": "PENDING",
      "totalAmount": 91.98,
      "items": [...],
      "createdAt": "2024-01-01T00:00:00Z",
      ...
    }
  ]
}
```

---

### Get Order Details

Get details of a specific order.

**Request**

```
GET /orders/:id
Authorization: Bearer <token>
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "orderNumber": "ORD-1704067200000-ABC123XYZ",
    "userId": "user_id",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "totalAmount": 91.98,
    "items": [...],
    "payment": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Admin Endpoints

### Create Product

Add a new product to the catalog (admin only).

**Request**

```
POST /admin/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Ticket to Ride",
  "description": "Claim railway routes across the map",
  "price": 55.99,
  "stock": 10,
  "image": null
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "Ticket to Ride",
    "price": 55.99,
    "stock": 10,
    "isActive": true,
    ...
  },
  "message": "Product created successfully"
}
```

---

### Update Product

Modify an existing product (admin only).

**Request**

```
PUT /admin/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 59.99,
  "stock": 15
}
```

**Response (200)**

```json
{
  "success": true,
  "data": { ... },
  "message": "Product updated successfully"
}
```

---

### Delete Product

Soft delete a product (marks as inactive).

**Request**

```
DELETE /admin/products/:id
Authorization: Bearer <admin_token>
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "isActive": false,
    ...
  },
  "message": "Product deleted successfully"
}
```

---

### Get All Orders (Admin)

View all orders in the system.

**Request**

```
GET /orders/all
Authorization: Bearer <admin_token>
```

**Response (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": "order_id",
      "orderNumber": "ORD-...",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "status": "PENDING",
      "totalAmount": 91.98,
      "items": [...],
      ...
    }
  ]
}
```

---

### Update Order Status

Change the status of an order (admin only).

**Request**

```
PUT /orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "PROCESSING"
}
```

**Valid Status Values**

- `PENDING`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `REFUNDED`

**Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "status": "PROCESSING",
    ...
  },
  "message": "Order updated successfully"
}
```

---

## Error Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Missing or invalid token |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource doesn't exist      |
| 409  | Conflict - Resource already exists      |
| 500  | Internal Server Error                   |

---

## Rate Limiting

Currently no rate limiting is applied. In production, implement:

- 100 requests per minute per IP
- 50 requests per minute per authenticated user

---

## CORS

The API allows requests from:

- `http://localhost:3001` (development)
- Configure `CORS_ORIGIN` in production

---

## Example Client Code

### Using Axios

```javascript
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Signup
const { data } = await api.post("/auth/signup", {
  email: "user@example.com",
  password: "SecurePass123",
  firstName: "John",
  lastName: "Doe",
});

// Get products
const { data: products } = await api.get("/products");

// Add to cart
await api.post("/cart/items", {
  productId: "catan",
  quantity: 1,
});
```

---

## Testing Endpoints

Use Postman, curl, or any HTTP client:

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'

# Get Products
curl -X GET http://localhost:3000/api/products
```

---

## Version

API Version: 1.0.0
Last Updated: 2024
