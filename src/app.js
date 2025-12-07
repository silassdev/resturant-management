const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const tableRoutes = require('./routes/tables');
const reservationRoutes = require('./routes/reservations');
const inventoryRoutes = require('./routes/inventory');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
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

module.exports = app;
