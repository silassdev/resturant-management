import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../src/app.js';
import { startTestDB, stopTestDB } from './setup.js';
import InventoryItem from '../src/models/InventoryItem.js';

let server;

beforeAll(async () => {
  await startTestDB();
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await stopTestDB();
});

describe('Menu routes', () => {
  it('creates menu item and lists it', async () => {
    const invRes = await request(server)
      .post('/api/inventory')
      .set('x-admin-token', 'admintoken_for_quick_demo')
      .send({ name: 'Tomato', quantity: 10, unit: 'pcs' });

    expect(invRes.status).toBe(201);

    const createRes = await request(server)
      .post('/api/menu')
      .set('x-admin-token', 'admintoken_for_quick_demo')
      .send({
        name: 'Tomato Soup',
        description: 'Warm soup',
        price: 4.0,
        ingredients: ['Tomato'],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe('Tomato Soup');

    const listRes = await request(server).get('/api/menu');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    const found = listRes.body.find(i => i.name === 'Tomato Soup');
    expect(found).toBeDefined();
  });
});
