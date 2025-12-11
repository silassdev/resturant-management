// src/controllers/orderController.js
import InventoryItem from '../models/InventoryItem.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';

// Helper: compute and apply inventory changes based on order items
async function applyInventoryChanges(items) {
  const needed = {};
  for (const oi of items) {
    // support both menuItemId or menuItem property (be tolerant)
    const menuId = oi.menuItemId || oi.menuItem;
    const menu = await MenuItem.findById(menuId);
    if (!menu) continue;
    for (const ing of (menu.ingredients || [])) {
      const perUnit = (typeof ing === 'object' ? (ing.qty || 1) : 1);
      const name = (typeof ing === 'object' ? ing.name : ing);
      needed[name] = (needed[name] || 0) + perUnit * (oi.quantity || 1);
    }
  }

  // Check availability
  const missing = [];
  for (const [name, qtyNeeded] of Object.entries(needed)) {
    const inv = await InventoryItem.findOne({ name });
    if (!inv || inv.quantity < qtyNeeded) {
      missing.push({ name, need: qtyNeeded, have: inv ? inv.quantity : 0 });
    }
  }
  if (missing.length) {
    const msg = 'Missing inventory: ' + missing.map(m => `${m.name} (need ${m.need}, have ${m.have})`).join(', ');
    const err = new Error(msg);
    err.status = 400;
    throw err;
  }

  // Decrement inventory (non-transactional). Use $inc to avoid race on single server.
  for (const [name, qtyNeeded] of Object.entries(needed)) {
    await InventoryItem.findOneAndUpdate({ name }, { $inc: { quantity: -qtyNeeded } });
  }
}

// Controller: placeOrder
export async function placeOrder(req, res, next) {
  try {
    const { tableId, items = [], notes } = req.body;
    if (!tableId) return res.status(400).json({ message: 'tableId is required' });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'items required' });

    // compute total price and enrich item details
    let total = 0;
    const enrichedItems = [];
    for (const it of items) {
      const menuId = it.menuItemId || it.menuItem;
      const menu = await MenuItem.findById(menuId);
      if (!menu) return res.status(400).json({ message: `Menu item not found: ${menuId}` });

      const qty = Number(it.quantity || 1);
      const lineTotal = (menu.price || 0) * qty;
      total += lineTotal;

      enrichedItems.push({
        menuItemId: menu._id,
        name: menu.name,
        price: menu.price,
        quantity: qty,
      });
    }

    await applyInventoryChanges(items);

    const created = await Order.create({
      tableId,
      items: enrichedItems,
      notes: notes || '',
      total,
      status: 'placed',
      placedAt: new Date(),
    });

    return res.status(201).json(created);
  } catch (err) {
    if (err?.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.find().sort({ placedAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required' });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (status === 'served' || status === 'completed') order.servedAt = new Date();
    await order.save();

    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}
