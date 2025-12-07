import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import menuRoutes from './routes/menuRoute.js';
import inventoryRoutes from './routes/inventoryRoute.js';
import orderRoutes from './routes/orderRoute.js';
import tableRoutes from './routes/tableRoute.js';
import reservationRoutes from './routes/reservationRoute.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/menu', menuRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);

import { adminOnly } from './middlewares/auth.js';
import { dailySales, stockAlerts } from '../utils/reporting.js';

app.get('/api/admin/report/daily-sales', adminOnly, async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : undefined;
    const r = await dailySales(date);
    res.json(r);
  } catch (err) { next(err); }
});

app.get('/api/admin/report/stock-alerts', adminOnly, async (req, res, next) => {
  try {
    const alerts = await stockAlerts();
    res.json(alerts);
  } catch (err) { next(err); }
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

connectDB(MONGODB_URI).then(() => {
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
