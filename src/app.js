import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import menuRoute from './routes/menuRoute.js';
import inventoryRoute from './routes/inventoryRoute.js';
import orderRoute from './routes/orderRoute.js';
import reservationRoute from './routes/reservationRoute.js';
import tableRoute from './routes/tableRoute.js';
import adminRoute from './routes/admin.js';

import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/menu', menuRoute);
app.use('/api/inventory', inventoryRoute);
app.use('/api/orders', orderRoute);
app.use('/api/reservations', reservationRoute);
app.use('/api/tables', tableRoute);
app.use('/api/admin', adminRoute);

app.use(errorHandler);

export default app;
