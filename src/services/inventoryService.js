import mongoose from 'mongoose';
import InventoryItem from '../models/InventoryItem.js';
import MenuItem from '../models/MenuItem.js';

export async function consumeInventory(itemsRequired) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const insufficient = [];

    for (const i of itemsRequired) {
      const inv = await InventoryItem.findById(i.inventoryItemId).session(session).lean();
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
      await session.abortTransaction();
      session.endSession();
      const err = new Error('Insufficient inventory');
      err.details = insufficient;
      err.status = 400;
      throw err;
    }

    // Apply decrements atomically
    const updates = itemsRequired.map(i =>
      InventoryItem.findByIdAndUpdate(
        i.inventoryItemId,
        { $inc: { quantity: -i.qtyRequired } },
        { new: true, session }
      )
    );
    await Promise.all(updates);

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}
