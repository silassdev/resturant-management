import { Router } from 'express';
const router = Router();
import { listTables, getTable, createTable, updateTable } from '../controllers/tableController.js';
import auth from '../middlewares/auth.js';

router.get('/', listTables);
router.post('/', auth('admin'), createTable);
router.put('/:id', auth('admin'), updateTable);

export default router;
