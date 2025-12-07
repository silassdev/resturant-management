import { find, create, findByIdAndUpdate, findById } from '../models/MenuItem';

async function listMenu(req, res, next) {
  try {
    const items = await find({ active: true });
    res.json(items);
  } catch (err) { next(err); }
}

async function createMenuItem(req, res, next) {
  try {
    const { name, description, price, inventoryItem } = req.body;
    const item = await create({ name, description, price, inventoryItem });
    res.status(201).json(item);
  } catch (err) { next(err); }
}

async function updateMenuItem(req, res, next) {
  try {
    const item = await findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) { next(err); }
}

async function getMenuItem(req, res, next) {
  try {
    const item = await findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) { next(err); }
}

export default { listMenu, createMenuItem, updateMenuItem, getMenuItem };
