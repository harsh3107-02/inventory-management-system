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
git clone <repository-url>
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

## Deployment

### Backend Deployment (Render)

1. Create a new PostgreSQL database on Render
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`: Your Render PostgreSQL connection string
   - Select Python 3.11 runtime
   - Build Command: `pip install -r Backend/requirements.txt`
   - Start Command: `cd Backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. Deploy and note the backend URL (e.g., `https://your-backend.onrender.com`)

### Frontend Deployment (Netlify)

1. Build the frontend locally:
```bash
cd Frontend
npm run build
```

2. Deploy to Netlify:
   - Option A: Connect GitHub repository directly via Netlify dashboard
   - Option B: Use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir Frontend/dist
     ```

3. Configure environment variable:
   - Create a `.env.production` file in the Frontend directory with:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. Rebuild and redeploy frontend to pick up new API URL

### Docker Hub (Optional)

Push backend image to Docker Hub:

```bash
docker build -t <username>/inventory-backend:latest ./Backend
docker login
docker push <username>/inventory-backend:latest
```

## Testing the Deployment

1. Open your frontend URL in a browser
2. Try adding a product
3. Try adding a customer
4. Verify data appears on Dashboard
5. Check browser console for any CORS or network errors

## Troubleshooting

### "Failed to fetch" errors on Products/Customers
- Ensure backend API URL is correctly set in frontend environment variables
- Check that trailing slashes are used: `/api/products/`, `/api/customers/`
- Verify backend is accessible from frontend URL

### Database connection errors
- Check `DATABASE_URL` is correctly formatted
- Ensure PostgreSQL database is created and accessible
- Verify credentials in environment variables

### CORS errors
- Backend has CORS middleware configured to allow all origins
- If issues persist, check backend logs: `docker-compose logs backend`

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

## Contributing

1. Create a feature branch
2. Make your changes
3. Push to GitHub
4. Create a pull request

## License

MIT License

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
