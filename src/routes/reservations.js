import { Router } from 'express';
const router = Router();
import { createReservation, listReservations } from '../controllers/reservationController.js';
import auth from '../middlewares/auth.js';

router.post('/', createReservation);
router.get('/', auth('admin'), listReservations);

export default router;
