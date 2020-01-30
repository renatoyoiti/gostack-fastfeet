import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../utils/truncate';

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('it should not login with invalid credentials', async () => {
    await factory.create('User', {
      email: 'admin@fastfeet.com',
      password: '123456',
    });

    const res = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@fastfeet.com',
        password: 'asdfsdf',
      });

    expect(res.status).toBe(401);
  });

  it('should login with valid credentials', async () => {
    await factory.create('User', {
      email: 'admin@fastfeet.com',
      password: '123456',
    });

    const res = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@fastfeet.com',
        password: '123456',
      });

    expect(res.status).toBe(200);
  });

  it('should return JWT token when signin', async () => {
    await factory.create('User', {
      email: 'admin@fastfeet.com',
      password: '123456',
    });

    const res = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@fastfeet.com',
        password: '123456',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
