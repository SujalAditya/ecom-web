# Deadmen Backend API

A Node.js + Express + MongoDB backend for the Deadmen e-commerce app.

## Features
- User & Admin Authentication (JWT)
- Product CRUD (admin)
- Cart management (user)
- Order placement and management
- Role-based access control

## Setup
1. Clone the repository and navigate to `/backend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see `.env.example` or sample below):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/deadmen
   JWT_SECRET=your_jwt_secret_here
   ```
4. Start MongoDB locally or use MongoDB Atlas.
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints (Summary)
### Auth
- `POST /api/auth/register` – Register user
- `POST /api/auth/login` – Login user
- `GET /api/auth/me` – Get current user info

### Admin
- `POST /api/admin/login` – Login admin
- (All `/api/admin/*` routes require admin JWT)

### Products
- `GET /api/products` – List products
- `GET /api/products/:id` – Product details
- `POST /api/products` – Add product (admin)
- `PUT /api/products/:id` – Edit product (admin)
- `DELETE /api/products/:id` – Delete product (admin)

### Cart
- `GET /api/cart` – Get user's cart
- `POST /api/cart` – Add to cart
- `PUT /api/cart/:itemId` – Update quantity
- `DELETE /api/cart/:itemId` – Remove item

### Orders
- `POST /api/orders` – Place order
- `GET /api/orders` – Get user's orders
- `GET /api/orders/admin/all` – All orders (admin)
- `PUT /api/orders/admin/:id` – Update order status (admin)

## Notes
- Use JWT in the `Authorization: Bearer <token>` header for protected routes.
- All admin routes require a user with `role: 'admin'`.
- Extend models/routes as needed for your application.
