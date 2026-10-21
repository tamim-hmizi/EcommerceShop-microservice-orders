import express from 'express';
import orderRoutes from './routes/orderRoutes.js';
import { client, httpRequestDurationMicroseconds } from './utils/metrics.js';

const app = express();
app.use(express.json());

// Prometheus metrics middleware
app.use((req, res, next) => {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(elapsedMs);
  });

  next();
});

// Prometheus metrics endpoint
app.get('/api/orders/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// API routes
app.use('/api/orders', orderRoutes);

export default app;
