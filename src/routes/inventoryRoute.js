import express from 'express';
import { listInventory, updateInventory, createInventoryItem, lowStockAlerts } from '../controllers/inventoryController.js';
import { adminOnly } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', listInventory);
router.get('/alerts/low', adminOnly, lowStockAlerts);
router.post('/', adminOnly, createInventoryItem);
router.put('/:id', adminOnly, updateInventory);

export default router;
