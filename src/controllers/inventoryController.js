import InventoryItem from '../models/InventoryItem.js';

export async function listInventory(req, res, next) {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) { next(err); }
}

export async function updateInventory(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await InventoryItem.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
}

export async function createInventoryItem(req, res, next) {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function lowStockAlerts(req, res, next) {
  try {
    const low = await InventoryItem.find({ $expr: { $lte: ["$quantity", "$lowStockThreshold"] } });
    res.json(low);
  } catch (err) { next(err); }
}
