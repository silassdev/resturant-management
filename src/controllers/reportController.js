import { dailySales, lowStockAlerts, topSellingItems } from '../services/reportingService';

async function getDailySales(req, res, next) {
  try {
    const date = req.query.date || new Date().toISOString();
    const result = await dailySales(date);
    res.json(result);
  } catch (err) { next(err); }
}

async function getStockAlerts(req, res, next) {
  try {
    const items = await lowStockAlerts();
    res.json(items);
  } catch (err) { next(err); }
}

async function getTopSelling(req, res, next) {
  try {
    const limit = parseInt(req.query.limit || '10', 10);
    const items = await topSellingItems(limit);
    res.json(items);
  } catch (err) { next(err); }
}

export default { getDailySales, getStockAlerts, getTopSelling };
