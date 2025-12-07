import { Router } from 'express';
const router = Router();
import { listTables, createTable, updateTable } from '../controllers/tableController';
import auth from '../middlewares/auth';

router.get('/', listTables);
router.post('/', auth('admin'), createTable);
router.put('/:id', auth('admin'), updateTable);

export default router;
