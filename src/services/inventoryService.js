const InventoryItem = require('../models/InventoryItem');

async function consumeInventory(itemsRequired) {
  
  const insufficient = [];
  for (const i of itemsRequired) {
    const inv = await InventoryItem.findById(i.inventoryItemId);
    if (!inv) {
      insufficient.push({ inventoryItemId: i.inventoryItemId, reason: 'not found' });
      continue;
    }
    if (inv.quantity < i.qtyRequired) {
      insufficient.push({ inventoryItemId: i.inventoryItemId, name: inv.name, available: inv.quantity, required: i.qtyRequired });
    }
  }
  if (insufficient.length) {
    const err = new Error('Insufficient inventory');
    err.details = insufficient;
    err.status = 400;
    throw err;
  }

  for (const i of itemsRequired) {
    await InventoryItem.findByIdAndUpdate(i.inventoryItemId, { $inc: { quantity: -i.qtyRequired } });
  }
}


async function mapOrderToInventory(menuMapping) {
  const { MenuItem } = require('../models/MenuItem');
  const MenuItemModel = require('../models/MenuItem');
  const items = [];
  for (const m of menuMapping) {
    const menuItem = await MenuItemModel.findById(m.menuItemId).populate('inventoryItem');
    if (!menuItem) throw Object.assign(new Error('Menu item not found'), { status: 404 });
    if (!menuItem.inventoryItem) {
      continue;
    }
    items.push({
      inventoryItemId: menuItem.inventoryItem._id,
      qtyRequired: m.qty * ( 1 )
    });
  }
  return items;
}

module.exports = { consumeInventory, mapOrderToInventory };
