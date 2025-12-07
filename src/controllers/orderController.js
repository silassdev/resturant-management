import { create, findById } from '../models/Order';
import { findByIdAndUpdate } from '../models/Table';
import { findById as _findById } from '../models/MenuItem';
import { consumeInventory, mapOrderToInventory } from '../services/inventoryService';

async function placeOrder(req, res, next) {
  try {
    const { items, type, tableId } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'Order must contain items' });

    const orderItems = [];
    let total = 0;
    for (const it of items) {
      const menu = await _findById(it.menuItem);
      if (!menu) return res.status(400).json({ message: `Menu item ${it.menuItem} not found` });
      const qty = it.quantity || 1;
      const price = menu.price;
      orderItems.push({ menuItem: menu._id, name: menu.name, quantity: qty, price });
      total += price * qty;
    }

    const mapping = items.map(i => ({ menuItemId: i.menuItem, qty: i.quantity || 1 }));
    const itemsRequired = await mapOrderToInventory(mapping);
    await consumeInventory(itemsRequired);

    const order = await create({ items: orderItems, total, type, table: tableId, status: 'processing' });

    if (type === 'dine-in' && tableId) {
      await findByIdAndUpdate(tableId, { status: 'occupied', currentOrder: order._id });
    }

    res.status(201).json(order);
  } catch (err) { next(err); }
}

async function getOrder(req, res, next) {
  try {
    const order = await findById(req.params.id).populate('items.menuItem').populate('table');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
}


async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });

    order.status = status;
    if (status === 'completed') {
      order.processedAt = new Date();
      if (order.table) {
        await findByIdAndUpdate(order.table, { status: 'available', currentOrder: null });
      }
    }
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
}

export default { placeOrder, getOrder, updateOrderStatus };
