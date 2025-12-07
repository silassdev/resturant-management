import { Router } from 'express';
const router = Router();
import { listInventory, createInventoryItem, updateInventoryItem } from '../controllers/inventoryController.js';
import auth from '../middlewares/auth.js';

router.get('/', auth(), listInventory);
router.post('/', auth('admin'), createInventoryItem);
router.put('/:id', auth('admin'), updateInventoryItem);

export default router;