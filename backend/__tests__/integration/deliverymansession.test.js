import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../utils/truncate';

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not login if deliveryman does not exist', async () => {
    await factory.create('Deliveryman');

    const res = await request(app)
      .post('/sessions/deliverymans')
      .send({
        id: '56d8c9',
      });

    expect(res.status).toBe(400);
    expect(res.body).toContainKey('error');
  });

  it('should login if deliveryman exists', async () => {
    const { dataValues: deliveryman } = await factory.create('Deliveryman');

    const res = await request(app)
      .post('/sessions/deliverymans')
      .send({
        id: deliveryman.id,
      });

    expect(res.status).toBe(200);
    expect(res.body).toContainKeys(['deliveryman', 'token']);
  });
});
