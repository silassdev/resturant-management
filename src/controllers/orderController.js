import InventoryItem from '../models/InventoryItem.js';
import MenuItem from '../models/MenuItem.js';

async function applyInventoryChanges(items) {
  const needed = {};
  for (const oi of items) {
    const menu = await MenuItem.findById(oi.menuItem);
    if (!menu) continue;
    for (const ing of (menu.ingredients || [])) {
      const perUnit = (typeof ing === 'object' ? (ing.qty||1) : 1);
      const name = (typeof ing === 'object' ? ing.name : ing);
      needed[name] = (needed[name] || 0) + perUnit * (oi.quantity || 1);
    }
  }

  const missing = [];
  for (const [name, qtyNeeded] of Object.entries(needed)) {
    const inv = await InventoryItem.findOne({ name });
    if (!inv || inv.quantity < qtyNeeded) missing.push({ name, need: qtyNeeded, have: inv ? inv.quantity : 0 });
  }
  if (missing.length) {
    const msg = 'Missing inventory: ' + missing.map(m => `${m.name} (need ${m.need}, have ${m.have})`).join(', ');
    const err = new Error(msg);
    err.status = 400;
    throw err;
  }

  for (const [name, qtyNeeded] of Object.entries(needed)) {
    await InventoryItem.findOneAndUpdate({ name }, { $inc: { quantity: -qtyNeeded } });
  }
}
