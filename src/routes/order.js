import { Router } from 'express';
const router = Router();
import { placeOrder, getOrder, updateOrderStatus } from '../controllers/orderController';
import auth from '../middlewares/auth';

router.post('/', placeOrder);
router.get('/:id', auth(), getOrder);
router.patch('/:id/status', auth('admin'), updateOrderStatus);

export default router;