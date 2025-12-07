import { Router } from 'express';
const router = Router();
import { createReservation, listReservations } from '../controllers/reservationController';
import auth from '../middlewares/auth';

router.post('/', createReservation);
router.get('/', auth('admin'), listReservations);

export default router;
