# 🪡 Darzee - Complete Tailor Management System

A full-stack web application for managing tailor shops with customer management, order tracking, and real-time notifications.

## 🏗️ Project Structure

```
darzee/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Application pages
│   │   ├── store/         # State management (Zustand)
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript definitions
│   └── public/
├── backend/           # Node.js + Express backend
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication & validation
│   ├── config/          # Database configuration
│   ├── utils/           # Helper functions
│   └── scripts/         # Database initialization
└── README.md
```

## ✨ Features

### 🔐 **Authentication & User Management**
- Role-based authentication (Tailor/Customer)
- JWT token-based security
- Profile management for both user types
- Secure password hashing with bcrypt

### 👥 **Customer Management** (Tailor Only)
- Add customers with detailed information
- Record precise body measurements
- Search and filter customers
- Update customer profiles and measurements

### 📦 **Order Management**
- Create orders with multiple items
- Set pricing, advance payments, and delivery dates
- Track order status (Pending → In Progress → Ready → Delivered)
- Payment tracking (advance vs. remaining balance)
- Order filtering and search capabilities

### 🔔 **Smart Notifications**
- Automatic ETA reminders for customers
- Order ready notifications
- Payment due alerts
- Overdue order warnings for tailors
- Real-time notification center

### 📊 **Role-Based Dashboards**
- **Tailor Dashboard**: Business metrics, customer overview, order management
- **Customer Dashboard**: Order tracking, delivery status, payment history

### 📱 **Progressive Web App (PWA)**
- Mobile-first responsive design
- Install as native app on mobile devices
- Offline-ready capabilities
- Touch-optimized interface

### 🎨 **Professional Tailoring-Themed UI**
- Custom tailoring loader animations (sewing machine, scissors, thread)
- Smooth page transitions with cloth-cutting effects
- Dark theme with navy blue and gold accents
- Professional, clean design aesthetic

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL Server
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure database
# Update .env file with your MySQL credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=password
# DB_NAME=darzee_db

# Initialize database and tables
npm run init-db

# Start development server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Database Setup

Make sure MySQL is running with these credentials:
- **Host**: localhost
- **User**: root
- **Password**: password
- **Database**: darzee_db (will be created automatically)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Customer Endpoints (Tailor Only)
- `GET /api/customers` - Get tailor's customers
- `POST /api/customers` - Add new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Order Endpoints
- `GET /api/orders` - Get orders (filtered by user role)
- `POST /api/orders` - Create new order (tailor only)
- `PUT /api/orders/:id` - Update order (tailor only)
- `DELETE /api/orders/:id` - Delete order (tailor only)

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Lucide React** for icons
- **Vite** for build tooling
- **PWA** capabilities

### Backend
- **Node.js** with Express
- **MySQL** database with connection pooling
- **JWT** authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS, Helmet, Rate Limiting** for security

## 🏃‍♂️ Development

### Available Scripts

**Backend:**
```bash
npm run dev        # Start development server with nodemon
npm run start      # Start production server
npm run init-db    # Initialize database and tables
```

**Frontend:**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🔒 Security Features

- JWT-based authentication with secure secret
- Password hashing with bcrypt (12 rounds)
- SQL injection prevention with parameterized queries
- XSS protection with input validation
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers

## 📱 Mobile Testing

The app is designed as a PWA and can be installed on mobile devices:

1. Open the app in Safari (iOS) or Chrome (Android)
2. Use "Add to Home Screen" option
3. The app will install and launch like a native app

## 🎯 Demo Accounts

**Tailor Account:**
- Email: `tailor@test.com`
- Password: `password`

**Customer Account:**
- Email: `customer@test.com`
- Password: `password`

## 🚀 Production Deployment

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=darzee_db
JWT_SECRET=your-super-secret-key
```

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Build & Deploy

1. Build frontend: `npm run build`
2. Deploy backend to your server (PM2, Docker, etc.)
3. Deploy frontend build to CDN/static hosting
4. Configure reverse proxy (Nginx) if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by real tailor shop workflows
- Designed for mobile-first user experience
- Professional UI/UX with tailoring-themed animations

---

**Happy Tailoring! 🪡✨**