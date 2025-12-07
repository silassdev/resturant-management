import Order from '../src/models/Order.js';
import InventoryItem from '../src/models/InventoryItem.js';

export async function dailySales(date) {
  const start = date ? new Date(date) : new Date();
  start.setHours(0,0,0,0);
  const end = new Date(start);
  end.setDate(start.getDate()+1);

  const result = await Order.aggregate([
    { $match: { placedAt: { $gte: start, $lt: end }, status: { $in: ['served','completed'] } } },
    { $unwind: '$items' },
    { $group: {
      _id: null,
      totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      orderCount: { $sum: 1 }
    }}
  ]);

  return result[0] || { totalSales: 0, orderCount: 0 };
}

export async function stockAlerts() {
  return InventoryItem.find({ $expr: { $lte: ["$quantity", "$lowStockThreshold"] } });
}
