import { find, create, findByIdAndUpdate } from '../models/Table';

async function listTables(req, res, next) {
  try {
    const tables = await find();
    res.json(tables);
  } catch (err) { next(err); }
}

async function createTable(req, res, next) {
  try {
    const table = await create(req.body);
    res.status(201).json(table);
  } catch (err) { next(err); }
}

async function updateTable(req, res, next) {
  try {
    const table = await findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!table) return res.status(404).json({ message: 'Not found' });
    res.json(table);
  } catch (err) { next(err); }
}

export default { listTables, createTable, updateTable };
