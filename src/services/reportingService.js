import Order from '../models/Order.js';
import InventoryItem from '../models/InventoryItem.js';
import mongoose from 'mongoose';

export async function dailySales(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const pipeline = [
    { $match: { createdAt: { $gte: start, $lt: end }, status: { $ne: 'cancelled' } } },
    { $group: { _id: null, totalSales: { $sum: '$total' }, orders: { $sum: 1 } } }
  ];

  const res = await Order.aggregate(pipeline);
  return res[0] || { totalSales: 0, orders: 0 };
}

export async function lowStockAlerts() {
  return InventoryItem.find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } });
}

export async function topSellingItems(limit = 10) {
  const pipeline = [
    { $unwind: '$items' },
    { $group: { _id: '$items.menuItem', qty: { $sum: '$items.quantity' } } },
    { $sort: { qty: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'menuitems',
        localField: '_id',
        foreignField: '_id',
        as: 'menu'
      }
    },
    { $unwind: { path: '$menu', preserveNullAndEmptyArrays: true } },
    { $project: { menuId: '$_id', name: '$menu.name', qty: 1 } }
  ];
  return Order.aggregate(pipeline);
}
