import express from 'express';
import { createReservation, cancelReservation } from '../controllers/reservationController.js';
import { adminOnly } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', createReservation);
router.post('/:id/cancel', adminOnly, cancelReservation);

export default router;