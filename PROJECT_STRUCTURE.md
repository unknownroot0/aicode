# Diceymio Project Structure

Complete directory tree of the Diceymio ecommerce platform:

```
diceymio/
│
├── apps/
│   ├── api/                                    # Express.js Backend
│   │   ├── src/
│   │   │   ├── app.ts                         # Main Express application
│   │   │   ├── config/
│   │   │   │   └── database.ts                # Prisma database connection
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts                    # JWT auth & authorization
│   │   │   │   ├── asyncHandler.ts            # Async/await wrapper
│   │   │   │   └── errorHandler.ts            # Global error handling
│   │   │   ├── modules/
│   │   │   │   ├── auth/                      # Authentication
│   │   │   │   │   ├── auth.route.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   └── auth.validation.ts
│   │   │   │   ├── product/                   # Product Management
│   │   │   │   │   ├── product.route.ts
│   │   │   │   │   ├── product.controller.ts
│   │   │   │   │   └── product.service.ts
│   │   │   │   ├── admin/                     # Admin Features
│   │   │   │   │   ├── admin-product.route.ts
│   │   │   │   │   ├── admin-product.controller.ts
│   │   │   │   │   ├── admin-product.service.ts
│   │   │   │   │   └── admin-product.validation.ts
│   │   │   │   ├── cart/                      # Shopping Cart
│   │   │   │   │   ├── cart.route.ts
│   │   │   │   │   ├── cart.controller.ts
│   │   │   │   │   ├── cart.service.ts
│   │   │   │   │   └── cart.validation.ts
│   │   │   │   ├── order/                     # Order Management
│   │   │   │   │   ├── order.route.ts
│   │   │   │   │   ├── order.controller.ts
│   │   │   │   │   ├── order.service.ts
│   │   │   │   │   └── order.validation.ts
│   │   │   │   └── payment/                   # Payment Structure
│   │   │   │       └── (ready for Stripe)
│   │   │   ├── utils/
│   │   │   │   ├── jwt.ts                     # Token generation/verification
│   │   │   │   ├── password.ts                # bcrypt hashing
│   │   │   │   ├── errors.ts                  # Custom error classes
│   │   │   │   └── response.ts                # Response formatting
│   │   │   └── types/
│   │   │       └── index.ts                   # TypeScript types
│   │   ├── prisma/
│   │   │   ├── schema.prisma                  # Database schema
│   │   │   └── seed.ts                        # Sample data seeding
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   └── .gitignore
│   │
│   └── web/                                    # Next.js Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx                 # Root layout
│       │   │   ├── page.tsx                   # Landing page
│       │   │   ├── globals.css                # Global styles
│       │   │   ├── auth/
│       │   │   │   ├── signup/
│       │   │   │   │   └── page.tsx           # Signup page
│       │   │   │   └── login/
│       │   │   │       └── page.tsx           # Login page
│       │   │   ├── products/
│       │   │   │   └── page.tsx               # Products listing
│       │   │   ├── cart/
│       │   │   │   └── page.tsx               # Shopping cart
│       │   │   ├── orders/
│       │   │   │   └── page.tsx               # Order history
│       │   │   └── admin/
│       │   │       └── page.tsx               # Admin dashboard
│       │   ├── components/                    # React components (expandable)
│       │   ├── lib/
│       │   │   ├── api.ts                     # Axios HTTP client
│       │   │   └── services.ts                # API service functions
│       │   ├── store/
│       │   │   ├── authStore.ts               # Auth state (Zustand)
│       │   │   └── cartStore.ts               # Cart state (Zustand)
│       │   └── types/
│       │       └── index.ts                   # TypeScript types
│       ├── public/                            # Static files
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.js
│       ├── .env.example
│       └── .gitignore
│
├── packages/
│   └── tsconfig/
│       └── base.json                          # Shared TypeScript config
│
├── docs/                                       # Documentation
│   ├── README.md                              # Main documentation
│   ├── SETUP_GUIDE.md                         # Installation guide
│   ├── API_DOCUMENTATION.md                   # API reference
│   ├── PROJECT_SUMMARY.md                     # Project overview
│   └── TODO.md                                # Feature checklist
│
├── package.json                               # Root monorepo config
├── turbo.json                                 # Turborepo configuration
├── tsconfig.json                              # Root TypeScript config
├── .gitignore                                 # Git ignore rules
├── .prettierrc                                # Code formatting rules
├── .prettierignore                            # Prettier ignore
├── setup.sh                                   # Automated setup script
└── README.md                                  # Project readme
```

---

## Module Architecture Details

### Auth Module

Handles user authentication and authorization

```
auth/
├── signup         → Validates input → Creates user → Returns JWT
├── login          → Validates credentials → Returns JWT
└── Middleware → Verifies token → Attaches user to request
```

### Product Module

Manages board game catalog

```
product/
├── List           → Returns all active products
├── Get Details    → Returns single product
└── Admin Only:
    ├── Create     → Add new product
    ├── Update     → Modify product
    └── Delete     → Soft delete product
```

### Cart Module

Shopping cart management

```
cart/
├── Get            → Fetch user's cart with items
├── Add Item       → Add product to cart (validates stock)
├── Update Item    → Change quantity
├── Remove Item    → Delete from cart
└── Clear Cart     → Remove all items (on checkout)
```

### Order Module

Order processing and tracking

```
order/
├── Create         → Convert cart to order (validates address)
├── Get User Orders → Fetch all user's orders
├── Get Details    → Single order with items
└── Admin Only:
    ├── Get All    → All orders in system
    └── Update Status → Change order status
```

---

## Database Schema Overview

```
User (1) ──── (1) Admin
  │
  ├── (1) ──── (1) Customer
  │
  ├── (1) ──── (1) Cart ──── (*) CartItem
  │
  ├── (*) ──── Order ──── (*) OrderItem
  │
  └── (*) ──── Address

Product (*) ──── CartItem
   │
   └── (*) ──── OrderItem

Order (1) ──── (1) Payment
```

---

## Frontend Pages Structure

```
pages/
├── /                      # Landing page (public)
├── /auth
│   ├── /signup           # Registration (public)
│   └── /login            # Login (public)
├── /products             # Product catalog (public)
├── /cart                 # Shopping cart (auth)
├── /orders               # Order history (auth)
└── /admin                # Admin dashboard (auth + admin role)
```

---

## API Routes Summary

```
GET    /api/health              ✓ Health check (public)

POST   /api/auth/signup         ✓ Register user
POST   /api/auth/login          ✓ Login user

GET    /api/products            ✓ List products
GET    /api/products/:id        ✓ Get product

GET    /api/cart                ✓ Get cart (auth)
POST   /api/cart/items          ✓ Add item (auth)
PUT    /api/cart/items/:id      ✓ Update item (auth)
DELETE /api/cart/items/:id      ✓ Remove item (auth)

POST   /api/orders              ✓ Create order (auth)
GET    /api/orders              ✓ Get user orders (auth)
GET    /api/orders/:id          ✓ Get order (auth)

POST   /api/admin/products      ✓ Create product (admin)
PUT    /api/admin/products/:id  ✓ Update product (admin)
DELETE /api/admin/products/:id  ✓ Delete product (admin)
GET    /api/orders/all          ✓ Get all orders (admin)
PUT    /api/orders/:id/status   ✓ Update status (admin)
```

---

## Key Files Summary

| File            | Purpose              | Language         |
| --------------- | -------------------- | ---------------- |
| app.ts          | Express app setup    | TypeScript       |
| schema.prisma   | Database definitions | Prisma           |
| seed.ts         | Sample data          | TypeScript       |
| auth.middleware | JWT verification     | TypeScript       |
| page.tsx        | Next.js pages        | TypeScript + JSX |
| authStore.ts    | Auth state           | TypeScript       |
| cartStore.ts    | Cart state           | TypeScript       |
| api.ts          | HTTP client          | TypeScript       |
| services.ts     | API calls            | TypeScript       |

---

## Configuration Files

```
Root Level:
├── package.json       - Monorepo config, scripts, dependencies
├── turbo.json         - Turborepo pipeline configuration
├── tsconfig.json      - Root TypeScript settings
├── .prettierrc         - Code formatting rules

API Level:
├── apps/api/tsconfig.json
├── apps/api/package.json
└── apps/api/.env.example

Web Level:
├── apps/web/tsconfig.json
├── apps/web/next.config.js
├── apps/web/package.json
└── apps/web/.env.example
```

---

## Environment Variables

### API (.env)

```
NODE_ENV
PORT
DATABASE_URL
JWT_SECRET
JWT_EXPIRY
STRIPE_SECRET_KEY
AWS_ACCESS_KEY_ID (optional)
AWS_SECRET_ACCESS_KEY (optional)
AWS_REGION (optional)
AWS_S3_BUCKET (optional)
```

### Web (.env)

```
NEXT_PUBLIC_API_URL
```

---

## Development Workflow

```
1. Clone/Setup
   ↓
2. Install dependencies (yarn install)
   ↓
3. Configure .env files
   ↓
4. Setup database (yarn prisma:migrate)
   ↓
5. Seed sample data (yarn prisma:seed)
   ↓
6. Start dev servers (yarn dev)
   ↓
7. API: http://localhost:3000
   Web: http://localhost:3001
```

---

## Deployment Targets

- **API**: Vercel, Heroku, EC2, Docker
- **Web**: Vercel, Netlify, Firebase
- **Database**: AWS RDS, Digital Ocean, Heroku Postgres
- **Storage**: AWS S3, Cloudinary

---

## Project Statistics

- **Total Files**: 50+
- **Lines of Code**: 2000+
- **Modules**: 6 (Auth, Product, Admin, Cart, Order, Payment)
- **Database Models**: 9
- **API Endpoints**: 15+
- **Pages**: 7
- **Stores**: 2 (Auth, Cart)

---

**Last Updated**: January 2024
**Version**: 0.1.0
**Status**: Complete & Ready for Development
