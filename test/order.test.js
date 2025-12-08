import request from 'supertest';
import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest';
import app from '../src/app.js';
import { startTestDB, stopTestDB } from './setup.js';


process.env.SKIP_DB_TESTS = 'true';


vi.mock('../src/models/MenuItem.js', () => {
  const findById = vi.fn();
  return { default: { findById } };
});
vi.mock('../src/models/InventoryItem.js', () => {
  const findOne = vi.fn();
  return { default: { findOne } };
});
vi.mock('../src/models/Order.js', () => {
  const create = vi.fn();
  const find = vi.fn();
  return { default: { create, find } };
});
vi.mock('../src/models/Table.js', () => {
  const findById = vi.fn();
  return { default: { findById } };
});

import MenuItem from '../src/models/MenuItem.js';
import InventoryItem from '../src/models/InventoryItem.js';
import Order from '../src/models/Order.js';
import Table from '../src/models/Table.js';

let server;

beforeAll(async () => {
  await startTestDB();

  MenuItem.findById.mockImplementation(async (id) => {
    if (id === 'menu1') {
      return { _id: 'menu1', name: 'Pizza', price: 10, ingredients: ['Dough'] };
    }
    return null;
  });

  InventoryItem.findOne.mockImplementation(async ({ name }) => {
    const inv = {
      _id: 'inv1',
      name,
      quantity: 10,
      async save() { return this; }
    };
    return inv;
  });


  Order.create.mockImplementation(async (payload) => {
    return { _id: 'o1', ...payload };
  });

  Table.findById.mockImplementation(async (id) => {
    if (id === 'table1') return { _id: 'table1', number: 1, seats: 4, status: 'available', async save() {} };
    return null;
  });

  server = app.listen(0);
});

afterAll(async () => {
  if (server && typeof server.close === 'function') await server.close();
  await stopTestDB();
});

describe('Order flow (DB skipped, model methods mocked)', () => {
  it('POST /api/orders places an order and decrements mocked inventory', async () => {
    const payload = {
      tableId: 'table1',
      items: [{ menuItemId: 'menu1', quantity: 2 }]
    };

    const res = await request(server)
      .post('/api/orders')
      .send(payload);


      expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('total');


    expect(MenuItem.findById).toHaveBeenCalledWith('menu1');
    expect(InventoryItem.findOne).toHaveBeenCalled();
    expect(Order.create).toHaveBeenCalled();

    const invObj = await InventoryItem.findOne({ name: 'Dough' });
    expect(invObj.quantity).toBe(8);
  });
});
