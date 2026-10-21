# EcommerceShop Orders Microservice

Creates and manages customer orders: order items, shipping address, total price, payment flag and status (Pending, Processing, Shipped, Delivered).

This service is one of seven Express/MongoDB microservices (auth, users, products, categories, carts, orders, favorites) that together form the backend of the EcommerceShop MERN application. Each service owns its routes under `/api/orders`, connects to MongoDB through Mongoose and exposes Prometheus metrics, so it can be built, deployed, scaled and monitored independently on Kubernetes.

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/orders` | Create an order for `req.user` |
| GET | `/api/orders` | List orders |
| GET | `/api/orders/:id` | Get an order by id (user populated) |
| PUT | `/api/orders/:id` | Update the order status |
| DELETE | `/api/orders/:id` | Delete an order |
| GET | `/api/orders/metrics` | Prometheus metrics |

> Order creation expects `req.user` to be resolved upstream; this service has no JWT verification middleware.

Data model: `Order` (user, orderItems, shippingAddress, totalPrice, isPaid, paidAt, status).

## Tech stack

- Node.js 22, Express 5 (ES modules)
- MongoDB with Mongoose
- prom-client (HTTP request duration histogram)
- Docker (node:22-alpine, non-root user)

## Environment variables

Copy `.env.example` to `.env` and set your own values. Never commit `.env`.

| Variable | Description |
|---|---|
| `PORT` | HTTP port (defaults to 5000) |
| `MONGO_URI` | MongoDB connection string |

## Run locally

```bash
npm install
cp .env.example .env   # then edit the values
npm start
```

The service listens on `http://localhost:5000` by default.

## Docker

```bash
docker build -t ecommerceshop-orders .
docker run --env-file .env -p 5000:5000 ecommerceshop-orders
```

## Related repositories

- [EcommerceShop-Frontend-K8S](https://github.com/tamim-hmizi/EcommerceShop-Frontend-K8S) - frontend for the microservice deployment
- [EcommerceShop-Frontend](https://github.com/tamim-hmizi/EcommerceShop-Frontend) - frontend for the monolithic backend
- [EcommerceShop-monolithic-backend](https://github.com/tamim-hmizi/EcommerceShop-monolithic-backend) - monolithic version of the backend
- [QuickOps-Frontend](https://github.com/tamim-hmizi/QuickOps-Frontend) - QuickOps platform used to deploy this application on AKS
- Other microservices: [auth](https://github.com/tamim-hmizi/EcommerceShop-microservice-auth), [users](https://github.com/tamim-hmizi/EcommerceShop-microservice-users), [products](https://github.com/tamim-hmizi/EcommerceShop-microservice-products), [categories](https://github.com/tamim-hmizi/EcommerceShop-microservice-categories), [carts](https://github.com/tamim-hmizi/EcommerceShop-microservice-carts), [favorites](https://github.com/tamim-hmizi/EcommerceShop-microservice-favorites)

## License

See [LICENSE](LICENSE).

---

Part of the MERN e-commerce use case for QuickOps, 2025, by Tamim Hmizi: https://tamim-hmizi.github.io/Portfolio/
