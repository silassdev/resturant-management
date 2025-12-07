import Reservation, { find } from '../models/Reservation';
import { findByIdAndUpdate } from '../models/Table';

async function createReservation(req, res, next) {
  try {
    const { name, partySize, startTime, tableId, contact } = req.body;
    const reservation = new Reservation({ name, partySize, startTime, table: tableId, contact });
    await reservation.save();
    if (tableId) {
      await findByIdAndUpdate(tableId, { status: 'reserved' });
    }
    res.status(201).json(reservation);
  } catch (err) { next(err); }
}

async function listReservations(req, res, next) {
  try {
    const reservations = await find().populate('table');
    res.json(reservations);
  } catch (err) { next(err); }
}

export default { createReservation, listReservations };
