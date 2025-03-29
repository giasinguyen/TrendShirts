# TrendShirts

A modern e-commerce platform for fashion retail with responsive design and comprehensive management features.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Overview

TrendShirts is a full-featured e-commerce platform specializing in fashion retail. The application provides a seamless shopping experience with advanced product filtering, user authentication, shopping cart functionality, and a robust checkout process. The admin dashboard offers comprehensive tools for inventory management, order processing, and sales analytics.

## Features

### Customer-facing Features
- Responsive product catalog with advanced filtering and search
- User registration and authentication
- Shopping cart and wishlist functionality
- Secure checkout process
- Order tracking
- User profile management

### Admin Features
- Comprehensive dashboard with sales analytics
- Product and inventory management
- Category management
- Order processing and fulfillment
- User management
- Promotional campaigns and discount management

## Technology Stack

### Frontend
- **React** 19.0.0
- **Tailwind CSS** 4.0.16
- **Vite** 6.2.0
- **React Router DOM** 7.4.0
- **Lucide React** (icons)
- **Context API** (state management)
- **Axios** 1.8.4

### Backend
- **Spring Boot** 3.x
- **Spring Security** with JWT authentication
- **Spring Data JPA**
- **Spring MVC** (RESTful APIs)
- **Lombok**
- **JWT Authentication**

### Database
- **MariaDB**

## Prerequisites

- Node.js (v18+)
- Java 17+
- MariaDB
- Maven or Gradle

## Installation

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/giasinguyen/trendshirts.git

# Navigate to the frontend directory
cd trendshirts/TrendShirts_Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to the backend directory
cd ../TrendShirts_Backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

### Database Configuration

1. Create a MariaDB database named `trendshirts`
2. Configure database credentials in `application.properties`

```properties
spring.datasource.url=jdbc:mariadb://localhost:3306/trendshirts
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```

## Project Structure

### Frontend Structure

```
TrendShirts_Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── CategoryContext.jsx
│   │   └── ProductContext.jsx
│   ├── hooks/
│   ├── pages/
│   │   ├── admin/
│   │   │   └── dashboard/
│   │   └── frontend/
│   │       ├── catalog/
│   │       ├── checkout/
│   │       └── user/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── index.html
├── package.json
└── vite.config.js
```

### Backend Structure

```
TrendShirts_Backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── fit/
│   │   │       └── iuh/
│   │   │           ├── config/
│   │   │           ├── controllers/
│   │   │           ├── dto/
│   │   │           ├── entity/
│   │   │           ├── exception/
│   │   │           ├── repository/
│   │   │           ├── security/
│   │   │           ├── service/
│   │   │           └── TrendShirtsApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/
├── pom.xml
└── README.md
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products with pagination and filtering |
| GET | `/api/products/{id}` | Get product details |
| POST | `/api/admin/products` | Add new product (Admin only) |
| PUT | `/api/admin/products/{id}` | Update product (Admin only) |
| DELETE | `/api/admin/products/{id}` | Delete product (Admin only) |

### Category Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/admin/categories` | Create new category (Admin only) |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/orders` | Get user's orders |
| POST | `/api/orders` | Create new order |
| GET | `/api/admin/orders` | Get all orders (Admin only) |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/stats` | Get dashboard statistics |
| GET | `/api/admin/dashboard/sales-report` | Get sales report |

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed with ❤️ Nguyen Tran Gia Si
