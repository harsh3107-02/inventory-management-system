# Inventory & Order Management System

A full-stack web application for managing products, customers, and orders. Built with FastAPI (backend), React (frontend), PostgreSQL (database), and Docker.

## Features

- **Product Management**: Create, read, update, and delete products with SKU tracking
- **Customer Management**: Manage customer information with email and phone
- **Order Management**: Create orders with multiple items and track inventory
- **Dashboard**: Real-time overview of inventory, customers, orders, and low-stock alerts
- **Responsive UI**: Built with React and Bootstrap for seamless experience

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Validation**: Pydantic

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Bootstrap 5
- **HTTP Client**: Fetch API

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Package Management**: npm, pip

## Local Development

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Setup & Run

1. **Clone the repository**
```bash
git clone https://github.com/harsh3107-02/inventory-management-system
cd Project
```

2. **Start with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Environment Variables

Create a `.env` file in the root directory:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=inventory
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory
VITE_API_URL=
```

## API Endpoints

### Dashboard
- `GET /dashboard` - Get dashboard statistics

### Products
- `GET /products/` - List all products
- `POST /products/` - Create a product
- `GET /products/{id}` - Get product details
- `PUT /products/{id}` - Update a product
- `DELETE /products/{id}` - Delete a product

### Customers
- `GET /customers/` - List all customers
- `POST /customers/` - Create a customer
- `GET /customers/{id}` - Get customer details
- `DELETE /customers/{id}` - Delete a customer

### Orders
- `GET /orders/` - List all orders
- `POST /orders/` - Create an order
- `DELETE /orders/{id}` - Cancel an order


## File Structure

```
Project/
├── Backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   │       ├── products.py
│   │       ├── customers.py
│   │       └── orders.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── runtime.txt
├── Frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── config.js
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── Dashboard.jsx
│   │       ├── Products.jsx
│   │       ├── Customers.jsx
│   │       ├── Orders.jsx
│   │       └── Navbar.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── docker-compose.yml
├── .gitignore
└── README.md
```



MIT License

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
