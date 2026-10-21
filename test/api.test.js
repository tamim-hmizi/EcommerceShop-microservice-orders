import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { bearer, useDatabase } from './helpers.js';

useDatabase();

const base = '/api/orders';
const order = () => ({
  orderItems: [{ product: new mongoose.Types.ObjectId().toString(), quantity: 2 }],
  shippingAddress: { address: '1 Main St', city: 'Tunis', postalCode: '1000', country: 'TN' },
  totalPrice: 40,
});

describe('orders service', () => {
  it('requires a token', async () => {
    await request(app).get(base).expect(401);
  });

  it('lists only the caller\'s own orders', async () => {
    const alice = new mongoose.Types.ObjectId().toString();
    const bob = new mongoose.Types.ObjectId().toString();
    await request(app).post(base).set(bearer(alice)).send(order()).expect(201);
    await request(app).post(base).set(bearer(bob)).send(order()).expect(201);

    const res = await request(app).get(base).set(bearer(alice)).expect(200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].user, alice);
  });

  it('lets only admins list every order', async () => {
    const admin = await User.create({ name: 'Admin', email: 'admin@example.com', isAdmin: true });
    const customer = await User.create({ name: 'Cara', email: 'cara@example.com' });
    await request(app).post(base).set(bearer(customer.id)).send(order()).expect(201);

    await request(app).get(`${base}/all`).set(bearer(customer.id)).expect(403);
    const res = await request(app).get(`${base}/all`).set(bearer(admin.id)).expect(200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].user.name, 'Cara');
  });

  it('updates the status and rejects unknown statuses', async () => {
    const user = new mongoose.Types.ObjectId().toString();
    const { body } = await request(app).post(base).set(bearer(user)).send(order()).expect(201);
    const res = await request(app).put(`${base}/${body._id}`).set(bearer(user)).send({ status: 'Shipped' }).expect(200);
    assert.equal(res.body.status, 'Shipped');
    await request(app).put(`${base}/${body._id}`).set(bearer(user)).send({ status: 'Lost' }).expect(400);
  });

  it('rejects an order without a shipping address', async () => {
    await request(app).post(base).set(bearer()).send({ ...order(), shippingAddress: undefined }).expect(400);
  });
});
