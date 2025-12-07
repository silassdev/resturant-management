import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/order.js';
import tableRoutes from './routes/tables.js';
import reservationRoutes from './routes/reservations.js';
import inventoryRoutes from './routes/inventory.js';
import adminRoutes from './routes/admin.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

app.use(errorHandler);

export default app;
