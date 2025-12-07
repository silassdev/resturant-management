import { Router } from 'express';
const router = Router();
import { listMenu, getMenuItem, createMenuItem, updateMenuItem } from '../controllers/menuController';
import auth from '../middlewares/auth';

router.get('/', listMenu);
router.get('/:id', getMenuItem);

router.post('/', auth('admin'), createMenuItem);
router.put('/:id', auth('admin'), updateMenuItem);

export default router;
