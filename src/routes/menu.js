import { Router } from 'express';
import { listMenu, getMenuItem, createMenuItem, updateMenuItem } from '../controllers/menuController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/', listMenu);
router.get('/:id', getMenuItem);
router.post('/', auth('admin'), createMenuItem);
router.put('/:id', auth('admin'), updateMenuItem);

export default router;