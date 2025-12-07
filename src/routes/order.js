import { Router } from 'express';
import { placeOrder, getOrder, updateOrderStatus } from '../controllers/orderController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/', placeOrder);
router.get('/:id', auth(), getOrder);
router.patch('/:id/status', auth('admin'), updateOrderStatus);

export default router;