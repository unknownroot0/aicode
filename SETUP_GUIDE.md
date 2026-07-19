# Diceymio - Board Game Ecommerce Platform

A lightweight ecommerce platform for selling board games with a modern tech stack: Express.js backend, Next.js frontend, and PostgreSQL database.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** 12+
- **Yarn** or **npm**

### Installation

1. **Clone and navigate**

   ```bash
   cd diceymio
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Setup API environment**

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   Edit `apps/api/.env` with your database credentials and JWT secret:

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/diceymio
   JWT_SECRET=your-super-secret-key
   STRIPE_SECRET_KEY=sk_test_...
   ```

4. **Setup Web environment**

   ```bash
   cp apps/web/.env.example apps/web/.env
   ```

5. **Setup database**

   ```bash
   # Run migrations
   yarn prisma:migrate

   # Seed sample data (includes 2 board games)
   yarn prisma:seed
   ```

6. **Start development servers**

   ```bash
   yarn dev
   ```

   This will start:
   - API: `http://localhost:3000`
   - Web: `http://localhost:3001`

## 📁 Project Structure

```
diceymio/
├── apps/
│   ├── api/                    # Express.js backend
│   │   ├── src/
│   │   │   ├── app.ts          # Main Express app
│   │   │   ├── config/         # Database config
│   │   │   ├── middleware/     # Auth, error handling
│   │   │   ├── modules/        # Feature modules
│   │   │   │   ├── auth/       # User signup/login
│   │   │   │   ├── product/    # Product listing
│   │   │   │   ├── cart/       # Shopping cart
│   │   │   │   ├── order/      # Order management
│   │   │   │   └── admin/      # Admin features
│   │   │   ├── utils/          # JWT, password, responses
│   │   │   └── types/          # TypeScript types
│   │   └── prisma/
│   │       ├── schema.prisma   # Database schema
│   │       └── seed.ts         # Sample data
│   │
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/           # Pages & layouts
│       │   │   ├── auth/      # Login/signup
│       │   │   ├── products/  # Product listing
│       │   │   ├── cart/      # Shopping cart
│       │   │   ├── orders/    # Order history
│       │   │   └── admin/     # Admin dashboard
│       │   ├── components/    # React components
│       │   ├── lib/          # API client & services
│       │   ├── store/        # Zustand stores
│       │   └── types/        # TypeScript types
│       └── public/           # Static files
│
└── packages/
    └── tsconfig/             # Shared TypeScript config
```

## 🗄️ Database Schema

### Core Models

**User**

- Email authentication
- Role-based access (CUSTOMER, ADMIN)
- Email verification support

**Product**

- Name, description, price, stock
- Image support (S3 URLs)
- Active/inactive status

**Cart**

- One cart per user
- Cart items with product references
- Quantity management

**Order**

- Order number, user reference
- Status tracking (PENDING → DELIVERED)
- Item list with pricing snapshot
- Shipping address

**Payment**

- Stripe integration
- Payment status tracking
- Order linkage

**Address**

- User shipping addresses
- Default address support

## 🔑 Key Features

### Authentication

- Email/password signup & login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with auth middleware

### Products

- List all products
- Product details view
- Admin: Create, update, delete products
- Stock management

### Shopping Cart

- Add/remove items
- Update quantities
- Cart persistence
- Clear cart on checkout

### Orders

- Create orders from cart
- Order history view
- Admin: View all orders
- Admin: Update order status
- Order status tracking

### Admin Dashboard

- View all orders
- Update order status
- Add new products
- Quick stats

## 🛣️ API Endpoints

### Authentication

```
POST   /api/auth/signup      # Register new user
POST   /api/auth/login       # Login user
```

### Products

```
GET    /api/products         # List all products
GET    /api/products/:id     # Get product details
POST   /api/admin/products   # Create product (admin)
PUT    /api/admin/products/:id    # Update product (admin)
DELETE /api/admin/products/:id    # Delete product (admin)
```

### Cart

```
GET    /api/cart             # Get user's cart
POST   /api/cart/items       # Add item to cart
PUT    /api/cart/items/:id   # Update cart item
DELETE /api/cart/items/:id   # Remove from cart
```

### Orders

```
POST   /api/orders           # Create order
GET    /api/orders           # Get user's orders
GET    /api/orders/:id       # Get order details
GET    /api/orders/all       # Get all orders (admin)
PUT    /api/orders/:id/status    # Update order status (admin)
```

## 📊 Sample Data

The seed script creates:

1. **Admin User**
   - Email: `admin@diceymio.com`
   - Password: `Admin@123456`

2. **Products**
   - Catan ($45.99) - 5 in stock
   - Ticket to Ride ($55.99) - 8 in stock

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection with helmet
- Request validation with Zod
- Role-based access control
- Protected API endpoints

## 📝 Environment Variables

### API (apps/api/.env)

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
STRIPE_SECRET_KEY=sk_test_...
```

### Web (apps/web/.env)

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🛠️ Tech Stack

### Backend

- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod
- **Password**: bcrypt
- **Server**: tsx for development, built with tsup

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **SSR**: Enabled by default

### DevOps

- **Monorepo**: Turborepo
- **Package Manager**: Yarn workspaces

## 📦 Scripts

### Root (monorepo)

```bash
yarn dev              # Start all services
yarn build            # Build all apps
yarn type-check       # Run TypeScript checks
yarn prisma:migrate   # Run database migrations
yarn prisma:seed      # Seed sample data
yarn prisma:studio    # Open Prisma Studio
```

### API

```bash
cd apps/api
yarn dev              # Start API server
yarn build            # Build for production
yarn prisma:generate  # Generate Prisma client
```

### Web

```bash
cd apps/web
yarn dev              # Start Next.js dev server
yarn build            # Build for production
yarn start            # Start production server
```

## 🧪 Testing

Currently, the project includes basic structure. To add tests:

```bash
# API tests
cd apps/api
yarn test

# E2E tests
yarn test:e2e
```

## 🚢 Deployment

### API

```bash
# Build
yarn build

# Start
node dist/app.js
```

Ensure these environment variables are set in production:

- `DATABASE_URL` - Production database
- `JWT_SECRET` - Strong secret key
- `NODE_ENV=production`

### Web

```bash
# Build
yarn build

# Start
yarn start
```

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Database Connection

- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env
- Run migrations: `yarn prisma:migrate`

### Module Not Found

- Clear node_modules: `rm -rf node_modules && yarn install`
- Regenerate Prisma: `yarn prisma:generate`

## 📚 Additional Features to Implement

- [ ] Email verification
- [ ] Password reset flow
- [ ] User profile management
- [ ] Product search & filtering
- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Email notifications
- [ ] Payment webhooks for Stripe
- [ ] Image upload to S3
- [ ] Analytics & reporting
- [ ] Inventory management
- [ ] Discount codes & promotions
- [ ] Multi-currency support

## 📝 Notes

- Admin credentials are seeded in the database during initial setup
- Product images can be added as URLs or uploaded to S3
- Cart is user-specific and cleared after checkout
- Orders contain price snapshots at time of purchase
- All timestamps are in UTC

## 📞 Support

For issues or questions, refer to the code comments and inline documentation throughout the project.

## 📄 License

MIT
