process.env.SKIP_DB_TESTS = 'true';
process.env.ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admintoken_for_quick_demo';

import { vi, beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { startTestDB, stopTestDB } from './setup.js';

vi.resetModules();

vi.mock('../src/middlewares/auth.js', () => {
  const auth = (role) => (req, res, next) => next();
  const adminOnly = (req, res, next) => next();
  return { auth, adminOnly };
});

vi.mock('../src/models/MenuItem.js', () => {
  const find = vi.fn();
  const create = vi.fn();
  const findById = vi.fn();
  return {
    default: { find, create, findById }
  };
});

let server;
let app;
let MenuItem;

beforeAll(async () => {
  ({ default: app } = await import('../src/app.js'));

  MenuItem = (await import('../src/models/MenuItem.js')).default;

  await startTestDB();

  MenuItem.find.mockResolvedValue([
    { _id: 'm1', name: 'Tomato Soup', price: 4.0, ingredients: ['Tomato'], active: true }
  ]);
  MenuItem.create.mockImplementation(async (payload) => ({ _id: 'm-new', ...payload }));
  MenuItem.findById.mockImplementation(async (id) => {
    if (id === 'm1') return { _id: 'm1', name: 'Tomato Soup', price: 4.0, ingredients: ['Tomato'] };
    return null;
  });

  server = app.listen(0);
});

afterAll(async () => {
  if (server && typeof server.close === 'function') await server.close();
  await stopTestDB();
});

describe('Menu routes (DB skipped, model methods mocked, auth mocked)', () => {
  it('GET /api/menu should return the mocked menu list', async () => {
    const res = await request(server).get('/api/menu');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('Tomato Soup');
  });

  it('POST /api/menu should create a menu item (admin mocked true)', async () => {
    const payload = {
      name: 'Margherita',
      price: 8.5,
      ingredients: ['Dough','Tomato','Cheese']
    };
    const res = await request(server)
      .post('/api/menu')
      .set('x-admin-token', process.env.ADMIN_TOKEN) 
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Margherita');
    expect(MenuItem.create).toHaveBeenCalled();
  });
});
