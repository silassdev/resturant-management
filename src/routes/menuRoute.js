import express from 'express';
import { listMenu, createMenuItem, updateMenuItem } from '../controllers/menuController.js';
import { adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', listMenu);
router.post('/', adminOnly, createMenuItem);
router.put('/:id', adminOnly, updateMenuItem);

export default router;
