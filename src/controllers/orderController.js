import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import InventoryItem from '../models/InventoryItem.js';
import Table from '../models/Table.js';

async function buildOrderItems(items) {
  const out = [];
  let total = 0;
  for (const it of items) {
    const menu = await MenuItem.findById(it.menuItemId);
    if (!menu) throw Object.assign(new Error('Menu item not found'), { status: 404 });
    const price = menu.price;
    out.push({
      menuItem: menu._id,
      name: menu.name,
      quantity: it.quantity || 1,
      price
    });
    total += price * (it.quantity || 1);
  }
  return { out, total };
}

async function applyInventoryChanges(items) {
  for (const oi of items) {
    const menu = await MenuItem.findById(oi.menuItem);
    if (!menu) continue;
    for (const ingredientName of menu.ingredients || []) {
      const inv = await InventoryItem.findOne({ name: ingredientName });
      if (!inv) throw Object.assign(new Error(`Missing inventory: ${ingredientName}`), { status: 400 });
      if (inv.quantity < oi.quantity) throw Object.assign(new Error(`Not enough ${ingredientName}`), { status: 400 });
      inv.quantity -= oi.quantity;
      await inv.save();
    }
  }
}

export async function placeOrder(req, res, next) {
  try {
    const { tableId, items = [], notes } = req.body;
    if (!items.length) return res.status(400).json({ message: 'No items provided' });

    let table = null;
    if (tableId) {
      table = await Table.findById(tableId);
      if (!table) return res.status(404).json({ message: 'Table not found' });
      if (table.status === 'maintenance') return res.status(400).json({ message: 'Table not usable' });
      if (table.status === 'available') {
        table.status = 'occupied';
        await table.save();
      }
    }

    const { out, total } = await buildOrderItems(items);

    await applyInventoryChanges(out);

    const order = await Order.create({
      table: table?._id,
      items: out,
      total,
      notes,
      status: 'preparing',
      placedAt: new Date()
    });

    res.status(201).json(order);
  } catch (err) { next(err); }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (status === 'served') order.servedAt = new Date();
    if (status === 'completed') {
      if (order.table) {
        const t = await Table.findById(order.table);
        if (t) {
          t.status = 'available';
          await t.save();
        }
      }
    }
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.find().populate('table').sort({ placedAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
}
