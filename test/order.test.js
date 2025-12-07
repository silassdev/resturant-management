import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../src/app.js';
import { startTestDB, stopTestDB } from './setup.js';
import InventoryItem from '../src/models/InventoryItem.js';

let server, menuItemId, tableId;

beforeAll(async () => {
  await startTestDB();
  server = app.listen(0);
  const inv = await request(server)
    .post('/api/inventory')
    .set('x-admin-token', 'admintoken_for_quick_demo')
    .send({ name: 'Dough', quantity: 10, unit: 'pcs' });
  expect(inv.status).toBe(201);

  const table = await request(server)
    .post('/api/tables')
    .set('x-admin-token', 'admintoken_for_quick_demo')
    .send({ number: 1, seats: 4 });
  expect(table.status).toBe(201);
  tableId = table.body._id;

  const menu = await request(server)
    .post('/api/menu')
    .set('x-admin-token', 'admintoken_for_quick_demo')
    .send({ name: 'Pizza', price: 10, ingredients: ['Dough'] });
  expect(menu.status).toBe(201);
  menuItemId = menu.body._id;
});

afterAll(async () => {
  await server.close();
  await stopTestDB();
});

describe('Order flow', () => {
  it('places order and decrements inventory', async () => {
    const invBefore = await request(server).get('/api/inventory');
    const doughBefore = invBefore.body.find(i => i.name === 'Dough');
    expect(doughBefore.quantity).toBe(10);

    const orderRes = await request(server)
      .post('/api/orders')
      .send({
        tableId,
        items: [{ menuItemId, quantity: 2 }]
      });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.total).toBeGreaterThan(0);

    const invAfter = await request(server).get('/api/inventory');
    const doughAfter = invAfter.body.find(i => i.name === 'Dough');
    expect(doughAfter.quantity).toBe(8);
  });
});
