import express from 'express';
import { placeOrder, updateOrderStatus, listOrders } from '../controllers/orderController.js';
import { adminOnly } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', placeOrder);
router.get('/', listOrders);
router.patch('/:id/status', adminOnly, updateOrderStatus);

export default router;
