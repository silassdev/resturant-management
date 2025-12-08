export function login(req, res) { res.json({ token: 'fake' }); }
export async function getDailySales(req, res) { res.json({ totalSales: 0, orderCount: 0 }); }
export async function getStockAlerts(req, res) { res.json([]); }
export async function getTopSelling(req, res) { res.json([]); }