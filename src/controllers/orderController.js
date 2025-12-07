import Order from '../models/Order.js';
import Table from '../models/Table.js';
import MenuItem from '../models/MenuItem.js';
import { consumeInventory, mapOrderToInventory } from '../services/inventoryService.js';

export async function placeOrder(req, res, next) {
  try {
    const { items, type, tableId } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must contain items' });
    }

    const orderItems = [];
    let total = 0;

    for (const it of items) {
      const menu = await MenuItem.findById(it.menuItem);
      if (!menu) {
        return res.status(400).json({ message: `Menu item ${it.menuItem} not found` });
      }

      const qty = it.quantity || 1;
      const price = menu.price;
      orderItems.push({ menuItem: menu._id, name: menu.name, quantity: qty, price });
      total += price * qty;
    }

    const mapping = items.map(i => ({ menuItemId: i.menuItem, qty: i.quantity || 1 }));
    const itemsRequired = await mapOrderToInventory(mapping);
    await consumeInventory(itemsRequired);

    const order = await Order.create({ items: orderItems, total, type, table: tableId, status: 'processing' });

    if (type === 'dine-in' && tableId) {
      await Table.findByIdAndUpdate(tableId, { status: 'occupied', currentOrder: order._id });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem')
      .populate('table');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });

    order.status = status;

    if (status === 'completed') {
      order.processedAt = new Date();
      if (order.table) {
        await Table.findByIdAndUpdate(order.table, { status: 'available', currentOrder: null });
      }
    }

    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
}
