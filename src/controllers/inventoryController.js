import { find, create, findByIdAndUpdate } from '../models/InventoryItem.js';

async function listInventory(req, res, next) {
  try {
    const items = await find();
    res.json(items);
  } catch (err) { next(err); }
}

async function createInventoryItem(req, res, next) {
  try {
    const item = await create(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
}

async function updateInventoryItem(req, res, next) {
  try {
    const item = await findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
}

export default { listInventory, createInventoryItem, updateInventoryItem };
