import { after, before, beforeEach } from 'node:test';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET ??= 'test-secret';

export const tokenFor = (id = new mongoose.Types.ObjectId().toString()) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

export const bearer = (id) => ({ Authorization: `Bearer ${tokenFor(id)}` });

// Each test file gets its own database on the MongoDB in MONGO_URI.
export function useDatabase() {
  before(async () => {
    const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
    await mongoose.connect(uri, { dbName: `test-orders-${process.pid}` });
  });
  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map((c) => c.deleteMany({}))
    );
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
}
