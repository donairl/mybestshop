# MyBestShop - Fullstack E-commerce Platform 🚀

A modern, futuristic e-commerce platform built with Next.js, Node.js, Prisma, and PostgreSQL. Features a beautiful UI with Framer Motion animations, comprehensive backend API, and full e-commerce functionality.

## ✨ Features

### 🛍️ E-commerce Features
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add, remove, and manage cart items
- **Wishlist**: Save favorite products for later
- **User Authentication**: Secure login/registration with JWT
- **Order Management**: Complete order lifecycle
- **Payment Support**: COD, Bank Transfer, Credit Card
- **Address Management**: Multiple shipping addresses
- **Invoice Generation**: PDF invoices for orders

### 🎨 Frontend Features
- **Modern UI**: Built with Tailwind CSS and shadcn/ui
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions with Framer Motion
- **State Management**: Zustand for cart and wishlist
- **Data Visualization**: Charts with Recharts
- **TypeScript**: Full type safety

### 🔧 Backend Features
- **RESTful API**: Express.js with comprehensive endpoints
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Input validation with express-validator
- **Error Handling**: Centralized error management
- **Admin Panel**: Product and order management

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **Framer Motion** - Animation library
- **Zustand** - State management
- **Recharts** - Chart library
- **TypeScript** - Type safety

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **PDFKit** - PDF generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mybestshop
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Setup

#### Backend Environment
```bash
cd backend
cp env.example .env
```

Edit `.env` file:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/mybestshop_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV="development"
```

#### Frontend Environment
```bash
cd frontend
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb mybestshop_db

# Setup database schema and seed data
npm run db:setup
```

### 5. Run Development Servers
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:backend    # Backend on port 5000
npm run dev:frontend   # Frontend on port 3000
```

## 📱 Available Pages

### Public Pages
- **Landing Page** (`/`) - Modern hero section with features
- **Products** (`/products`) - Product grid with filters
- **Product Detail** (`/products/[id]`) - Individual product view
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration

### Protected Pages
- **Dashboard** (`/dashboard`) - User account overview
- **Cart** (`/cart`) - Shopping cart management
- **Wishlist** (`/wishlist`) - Saved products
- **Orders** (`/orders`) - Order history
- **Addresses** (`/addresses`) - Shipping address management
- **Checkout** (`/checkout`) - Order completion
- **Invoice** (`/invoice/[orderId]`) - Order invoice

### Admin Pages
- **Admin Dashboard** (`/admin`) - Sales analytics
- **Product Management** (`/admin/products`) - CRUD operations
- **Order Management** (`/admin/orders`) - Order status updates

## 🔐 Sample Accounts

After running the seeder, you'll have these accounts:

### Admin User
- **Email**: admin@mybestshop.com
- **Password**: admin123
- **Role**: ADMIN

### Regular User
- **Email**: user@mybestshop.com
- **Password**: user123
- **Role**: USER

## 🗄️ Database Schema

The application includes these main entities:
- **Users** - Customer and admin accounts
- **Products** - Product catalog with categories
- **Cart Items** - Shopping cart contents
- **Wishlist** - Saved products
- **Orders** - Order management
- **Order Items** - Individual order products
- **Addresses** - Shipping addresses
- **Payments** - Payment transactions

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - List products with pagination
- `GET /api/products/featured` - Featured products
- `GET /api/products/:id` - Product details
- `GET /api/products/category/:category` - Products by category

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove cart item

### Orders
- `POST /api/orders/create` - Create order from cart
- `GET /api/orders` - User orders
- `GET /api/orders/:id` - Order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/products` - Manage products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Build and start the server:
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
1. Build the application:
```bash
cd frontend
npm run build
npm start
```

2. Deploy to Vercel, Netlify, or your preferred platform

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📁 Project Structure

```
mybestshop/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Custom middleware
│   │   └── seeders/        # Database seeders
│   ├── prisma/             # Database schema
│   └── package.json
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # Reusable components
│   │   ├── lib/            # Utility functions
│   │   ├── store/          # Zustand stores
│   │   └── types/          # TypeScript types
│   └── package.json
├── package.json             # Root package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/mybestshop/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Prisma](https://www.prisma.io/) for the excellent ORM

---

**Built with ❤️ by the MyBestShop Team**
