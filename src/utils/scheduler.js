import cron from 'node-cron';
import { stockAlerts } from './reporting.js';

export function startScheduler() {
  cron.schedule('0 * * * *', async () => {
    try {
      const alerts = await stockAlerts();
      if (alerts.length) {
        console.log('Stock alerts:', alerts.map(a => ({ name: a.name, qty: a.quantity })));
      }
    } catch (err) {
      console.error('Scheduler error', err);
    }
  });
}
