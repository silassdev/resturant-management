import MenuItem from '../models/MenuItem.js';

export async function listMenu(req, res, next) {
  try {
    const items = await MenuItem.find({ active: true });
    res.json(items);
  } catch (err) { next(err); }
}

export async function createMenuItem(req, res, next) {
  try {
    const { name, description, price, inventoryItem } = req.body;
    const item = await MenuItem.create({ name, description, price, inventoryItem });
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function updateMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) { next(err); }
}

export async function getMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) { next(err); }
}
