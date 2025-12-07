import MenuItem from '../models/MenuItem.js';

export async function listMenu(req, res, next) {
  try {
    const items = await MenuItem.find({ active: true });
    res.json(items);
  } catch (err) { next(err); }
}

export async function createMenuItem(req, res, next) {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function updateMenuItem(req, res, next) {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch(err) { next(err); }
}
