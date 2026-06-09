# 🏗️ Darzee Backend API

Node.js + Express backend for the Darzee tailor management system with MySQL database.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file with your MySQL credentials:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=darzee_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
```

### 3. Initialize Database
```bash
npm run init-db
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role ENUM('tailor', 'customer') NOT NULL,
  profile_image VARCHAR(255),
  shop_name VARCHAR(255),
  experience INT,
  specialization JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Customers Table
```sql
CREATE TABLE customers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  tailor_id VARCHAR(36) NOT NULL,
  measurements JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tailor_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  tailor_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'in_progress', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  advance_amount DECIMAL(10,2) DEFAULT 0,
  remaining_amount DECIMAL(10,2) NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estimated_delivery_date DATE NOT NULL,
  actual_delivery_date DATE NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tailor_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🛡️ API Security

- **JWT Authentication**: All protected routes require valid JWT tokens
- **Role-based Access**: Endpoints restricted by user role (tailor/customer)
- **Input Validation**: All inputs validated using express-validator
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Password Hashing**: bcrypt with 12 rounds
- **SQL Injection Protection**: Parameterized queries only
- **CORS**: Configured for frontend domain
- **Security Headers**: Helmet.js for additional security

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/verify` | Verify JWT token | No |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |

### Customers (Tailor Only)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/customers` | Get tailor's customers | Yes (Tailor) |
| POST | `/api/customers` | Add new customer | Yes (Tailor) |
| PUT | `/api/customers/:id` | Update customer | Yes (Tailor) |
| DELETE | `/api/customers/:id` | Delete customer | Yes (Tailor) |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | Get orders (filtered by role) | Yes |
| POST | `/api/orders` | Create new order | Yes (Tailor) |
| PUT | `/api/orders/:id` | Update order | Yes (Tailor) |
| DELETE | `/api/orders/:id` | Delete order | Yes (Tailor) |

### Designs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/designs` | Get all active designs | No |
| POST | `/api/designs` | Add new design | Yes (Tailor) |
| PUT | `/api/designs/:id` | Update design | Yes (Tailor) |
| DELETE | `/api/designs/:id` | Soft delete design | Yes (Tailor) |

### Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get user notifications | Yes |
| POST | `/api/notifications` | Create notification | Yes |
| PUT | `/api/notifications/:id/read` | Mark notification as read | Yes |
| PUT | `/api/notifications/read-all` | Mark all notifications as read | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | Yes |

## 📝 Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Tailor",
  "email": "john@tailorshop.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "role": "tailor",
  "shopName": "John's Custom Tailoring",
  "experience": 10,
  "specialization": ["Suits", "Shirts", "Alterations"]
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "customer_id": "uuid-customer-id",
  "items": [
    {
      "design_id": "uuid-design-id",
      "design_name": "Custom Suit",
      "quantity": 1,
      "unit_price": 2500.00,
      "measurements": {
        "chest": 40,
        "waist": 34,
        "shoulder": 18
      },
      "customizations": ["Navy blue fabric", "Peak lapels"]
    }
  ],
  "advance_amount": 1000.00,
  "estimated_delivery_date": "2024-02-15",
  "notes": "Client prefers slim fit"
}
```

## 🔧 Environment Configuration

### Development
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
```

### Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secure-production-secret
```

## 🐛 Error Handling

All endpoints return standardized error responses:
```json
{
  "error": "Error message",
  "message": "Detailed description (development only)",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","phone":"+1234567890","role":"tailor"}'
```

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "darzee-backend"
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

## 📊 Performance

- **Connection Pooling**: MySQL connection pool (max 10 connections)
- **Compression**: gzip compression enabled
- **Rate Limiting**: 100 requests/15min per IP
- **Query Optimization**: Indexed queries, efficient joins

## 🛠️ Development Tools

- **Nodemon**: Auto-restart during development
- **Morgan**: HTTP request logging
- **Express Validator**: Input validation
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

---

Built with ❤️ for efficient tailor shop management.