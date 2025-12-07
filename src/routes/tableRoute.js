import express from 'express';
import { listTables, createTable, checkAvailability } from '../controllers/tableController.js';
import { adminOnly } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', listTables);
router.post('/', adminOnly, createTable);
router.get('/availability', checkAvailability);

export default router;
