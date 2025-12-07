import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';

export async function listTables(req, res, next) {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch(err) { next(err); }
}

export async function createTable(req, res, next) {
  try {
    const t = await Table.create(req.body);
    res.status(201).json(t);
  } catch (err) { next(err); }
}

export async function checkAvailability(req, res, next) {
  try {
    const { seats, datetime } = req.query;
    const dt = datetime ? new Date(datetime) : new Date();
    const reserved = await Reservation.find({
      reservedAt: { $lte: dt },
      status: 'active'
    }).distinct('table');

    const tables = await Table.find({
      seats: { $gte: seats ? Number(seats) : 1 },
      _id: { $nin: reserved },
      status: 'available'
    });
    res.json(tables);
  } catch(err) { next(err); }
}
