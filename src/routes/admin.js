import { Router } from 'express';
const router = Router();
import { login } from '../controllers/authController.js';
import { getDailySales, getStockAlerts, getTopSelling } from '../controllers/reportController.js';
import auth from '../middlewares/auth.js';

router.post('/login', login);

router.get('/reports/daily-sales', auth('admin'), getDailySales);
router.get('/reports/stock-alerts', auth('admin'), getStockAlerts);
router.get('/reports/top-selling', auth('admin'), getTopSelling);

export default router;