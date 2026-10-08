# Swadify - Swiggy-style food delivery clone

Next.js 14 (App Router) frontend + Node.js/Express backend. Fully responsive (mobile bottom nav, tablet and desktop layouts).

## Features
- Browse restaurants, search by restaurant, cuisine or dish
- Cuisine categories, sort, Fast delivery, Pure veg and Rating 4.5+ filters
- Restaurant page with category-wise menu and Veg-only toggle
- Cart with quantity controls, single-restaurant rule, saved in localStorage
- Bill details (delivery fee, 5% tax)
- Signup / login (JWT + bcrypt)
- Checkout with address and payment method (demo)
- Orders list and live order tracking (status updates automatically every few seconds)
- Server recalculates prices on every order (client prices are never trusted)

## Run it

### 1. Backend (port 5000)
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (port 3000)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

Env files are already included: `backend/.env` and `frontend/.env.local`.

## Folder structure
```
backend/src
  server.js            Express app
  data/restaurants.js  Restaurants + menus (in-memory)
  routes/              restaurants, auth, orders
  middleware/auth.js   JWT helpers
frontend
  app/                 Pages: /, /restaurant/[id], /cart, /checkout, /orders, /orders/[id], /login
  components/          Navbar, Hero, CategoryStrip, FilterBar, RestaurantCard, MenuItem, CartBar, BillDetails, OrderTracker...
  context/             AuthContext, CartContext
  lib/                 api.js (fetch wrapper), format.js
```

## API
| Method | Endpoint | Notes |
|---|---|---|
| GET | /api/restaurants | `search, cuisine, veg, fast, minRating, sort` |
| GET | /api/restaurants/:id | Restaurant with full menu |
| POST | /api/auth/signup | `name, email, password` |
| POST | /api/auth/login | `email, password` |
| POST | /api/orders | Auth required. `restaurantId, items[{id,qty}], address, paymentMethod` |
| GET | /api/orders | Auth required. Your orders |
| GET | /api/orders/:id | Auth required. Order with live status |

## Note
Data is stored in memory, so users and orders reset when the backend restarts.
To make it production-like, replace the in-memory arrays with MongoDB (Mongoose) or PostgreSQL.

## Next steps to extend
1. MongoDB for users, restaurants and orders
2. Real food images (add an `image` URL per restaurant and menu item)
3. Razorpay payment integration
4. Restaurant admin panel, ratings and reviews, coupon codes
