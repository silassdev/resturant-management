import InventoryItem from '../models/InventoryItem.js';
import MenuItem from '../models/MenuItem.js';


export async function mapOrderToInventory(menuMapping) {
  const items = [];

  for (const m of menuMapping) {
    const menuItem = await MenuItem.findById(m.menuItemId)
      .populate('inventoryItem')
      .lean();

    if (!menuItem) {
      const err = new Error(`Menu item ${m.menuItemId} not found`);
      err.status = 404;
      throw err;
    }

    if (!menuItem.inventoryItem) {
      continue;
    }

    const qty = m.qty || 1;
    items.push({
      inventoryItemId: String(menuItem.inventoryItem._id),
      qtyRequired: qty,
    });
  }

  return items;
}

export async function consumeInventory(itemsRequired) {
  const insufficient = [];

  for (const i of itemsRequired) {
    const inv = await InventoryItem.findById(i.inventoryItemId).lean();
    if (!inv) {
      insufficient.push({ inventoryItemId: i.inventoryItemId, reason: 'not found' });
      continue;
    }
    if (inv.quantity < i.qtyRequired) {
      insufficient.push({
        inventoryItemId: i.inventoryItemId,
        name: inv.name,
        available: inv.quantity,
        required: i.qtyRequired,
      });
    }
  }

  if (insufficient.length) {
    const err = new Error('Insufficient inventory');
    err.details = insufficient;
    err.status = 400;
    throw err;
  }

  const updates = itemsRequired.map(i =>
    InventoryItem.findByIdAndUpdate(
      i.inventoryItemId,
      { $inc: { quantity: -i.qtyRequired } },
      { new: true }
    )
  );
  await Promise.all(updates);
}
