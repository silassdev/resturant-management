import express from 'express';
import { auth } from '../middlewares/auth.js';
import { login, getDailySales, getStockAlerts, getTopSelling } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', login);

router.get('/reports/daily-sales', auth('admin'), getDailySales);
router.get('/reports/stock-alerts', auth('admin'), getStockAlerts);
router.get('/reports/top-selling', auth('admin'), getTopSelling);

export default router;