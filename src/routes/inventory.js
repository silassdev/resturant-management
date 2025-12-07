import { Router } from 'express';
const router = Router();
import { listInventory, createInventoryItem, updateInventoryItem } from '../controllers/inventoryController';
import auth from '../middlewares/auth';

router.get('/', auth(), listInventory);
router.post('/', auth('admin'), createInventoryItem);
router.put('/:id', auth('admin'), updateInventoryItem);

export default router;