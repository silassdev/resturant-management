import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';

export async function createReservation(req, res, next) {
  try {
    const { customerName, phone, partySize, reservedAt, tableId, notes } = req.body;

    if (tableId) {
      const table = await Table.findById(tableId);
      if (!table) return res.status(404).json({ message: 'Table not found' });
      if (table.status !== 'available') return res.status(400).json({ message: 'Table not available' });
      table.status = 'reserved';
      await table.save();
    } else {
    }

    const reservation = await Reservation.create({
      customerName, phone, partySize, reservedAt, table: tableId, notes
    });

    res.status(201).json(reservation);
  } catch (err) { next(err); }
}

export async function cancelReservation(req, res, next) {
  try {
    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    r.status = 'cancelled';
    await r.save();
    if (r.table) {
      const TableModel = (await import('../models/Table.js')).default;
      const t = await TableModel.findById(r.table);
      if (t) {
        t.status = 'available';
        await t.save();
      }
    }
    res.json({ message: 'Cancelled' });
  } catch (err) { next(err); }
}
