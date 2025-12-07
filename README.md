#  Smart Restaurant Management System

A modern and modular backend system for managing restaurant operations such as orders, tables, reservations, inventory, and reporting — built with **Node.js**, **Express.js**, and **MongoDB**.

---

##  Features

###  Core Restaurant Operations

* **Menu Management**

  * Add, edit, delete, and view menu items
  * Categorize dishes (e.g., drinks, mains, desserts)

* **Order Management**

  * Create new customer orders
  * Assign orders to tables
  * Track order status (pending → preparing → served → completed)

* **Table Management**

  * Track table availability
  * Automatically lock/unlock tables based on reservations or orders

* **Reservations**

  * Create and manage table reservations
  * Check real-time table availability
  * Prevent overlapping bookings

* **Inventory Management**

  * Track stock items (ingredients, drinks, supplies)
  * Auto-update stock based on menu items ordered
  * Configurable stock thresholds
  * Supports low-stock alerts

### 📊 Reporting & Admin Panel

* **Daily/Weekly/Monthly Sales Reports**
* **Order volume analytics**
* **Top-selling menu items**
* **Inventory usage reports**
* **Stock alerts & notifications**
* **Admin authentication & role-based access**

---

## 🛠️ Tech Stack

| Layer                  | Technology                          |
| ---------------------- | ----------------------------------- |
| Backend Framework      | Node.js + Express.js                |
| Database               | MongoDB + Mongoose                  |
| Authentication         | JWT or session-based (configurable) |
| Logging                | Morgan / Winston                    |
| Environment Management | dotenv                              |
| API Architecture       | RESTful                             |

---

##  Project Structure

```
smart-restaurant-backend/
│
├── src/
│   ├── models/            # Mongoose schemas
│   ├── controllers/       # Request handlers
│   ├── routes/            # API route definitions
│   ├── middleware/        # Authentication & utilities
│   ├── services/          # Business logic (order processing, reporting)
│   ├── utils/             # Helpers (e.g., stock calculations)
│   └── config/            # DB + environment config
│
├── tests/                 # Unit and integration tests
├── .env.example           # Environment variable template
├── package.json
└── README.md
```

---

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/silassdev/restaurant-management.git
cd restaurant-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env` using `.env.example`:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/restaurant
JWT_SECRET=your-secret-key
```

### 4. Start development server

```bash
npm run dev
```

---

## 🔌 API Endpoints

### **Menu**

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| GET    | `/api/menu`     | List menu items  |
| POST   | `/api/menu`     | Add menu item    |
| PUT    | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Remove item      |

### **Orders**

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| POST   | `/api/orders`            | Place a new order   |
| GET    | `/api/orders/:id`        | View order          |
| PUT    | `/api/orders/:id/status` | Update order status |

### **Tables**

| GET | `/api/tables` | List all tables |
| PUT | `/api/tables/:id` | Update table state |

### **Reservations**

| POST | `/api/reservations` | Make reservation |
| GET | `/api/reservations` | List reservations |

### **Inventory**

| GET | `/api/inventory` | View stock |
| PUT | `/api/inventory/:id` | Update stock |

### **Reports**

| GET | `/api/reports/sales/daily` | Daily sales report |
| GET | `/api/reports/stock-alerts` | Low-stock alerts |

---

##  Key System Logic

###  Order Processing Flow

1. Validate menu items
2. Check stock availability
3. Deduct inventory quantities
4. Mark table as “occupied”
5. Generate order receipt + store transaction

###  Reservation Validation

* Prevent double booking
* Auto-attach table to reservation
* Release table after order or scheduled time

###  Auto Inventory Update

* Menu item → ingredient mapping
* Each order reduces ingredient quantities
* Trigger stock alerts if below threshold

---

##  Authentication

The system includes:

* JWT-based authentication
* Admin role: full access
* Staff role: limited access (orders, tables only)

---

## 🧪 Testing

Run tests:

```bash
npm test
```

