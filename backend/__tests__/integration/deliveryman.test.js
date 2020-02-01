import request from 'supertest';

import app from '../../src/app';
import truncate from '../utils/truncate';
import getToken from '../utils/returnToken';
import factory from '../factories';

describe('Create', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not create a deliveryman with invalid data', async () => {
    const token = await getToken();

    const res = await request(app)
      .post('/deliverymans')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Joaquino',
      });

    expect(res.status).toBe(400);
    expect(res.body).toContainKey('error');
  });

  it('should not create a deliveryman if the email already exists', async () => {
    const token = await getToken();

    await factory.create('Deliveryman', {
      email: 'joaquino@fastfeet.com',
    });

    const res = await request(app)
      .post('/deliverymans')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Joaquino',
        email: 'joaquino@fastfeet.com',
      });

    expect(res.status).toBe(400);
    expect(res.body).toContainKey('error');
  });

  it('should create a deliveryman if all data is valid', async () => {
    const token = await getToken();

    const res = await request(app)
      .post('/deliverymans')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Joaquino Fernandes',
        email: 'joaquino.f@fastfeet.com',
      });

    expect(res.status).toBe(200);
    expect(res.body).toContainAllKeys(['id', 'name', 'email']);
  });
});

describe('List', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should list all deliverymans', async () => {
    const token = await getToken();

    await factory.create('Deliveryman', {
      email: 'teste2@gmail.com',
    });
    await factory.create('Deliveryman', {
      email: 'teste@gmail.com',
    });

    const res = await request(app)
      .get('/deliverymans')
      .set('Authorization', `bearer ${token}`)
      .query('page=1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  });
});

describe('Update', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not update deliveryman if it not exists', async () => {
    const token = await getToken();

    const res = await request(app)
      .put('/deliverymans/d50c68')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Mariazinha',
      });

    expect(res.status).toBe(400);
    expect(res.body).toContainKey('error');
  });

  it('should not update deliveryman if the email already exists', async () => {
    const token = await getToken();

    const deliveryman = await factory.create('Deliveryman');
    await factory.create('Deliveryman', {
      email: 'teste@gmail.com',
    });

    const { id } = deliveryman.dataValues;

    const res = await request(app)
      .put(`/deliverymans/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Mariazinha',
        email: 'teste@gmail.com',
      });

    expect(res.status).toBe(400);
    expect(res.body).toContainKey('error');
  });

  it('should not update deliveryman with invalid data', async () => {
    const token = await getToken();

    const deliveryman = await factory.create('Deliveryman');

    const { id } = deliveryman.dataValues;

    const res = await request(app)
      .put(`/deliverymans/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Mariazinha',
        email: 'testegmail.com',
      });

    expect(res.status).toBe(400);
    expect(res.body).toContainKey('error');
  });

  it('should update deliveryman with valid data', async () => {
    const token = await getToken();

    const deliveryman = await factory.create('Deliveryman');

    const { id } = deliveryman.dataValues;

    const res = await request(app)
      .put(`/deliverymans/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Mariazinha',
        email: 'teste@gmail.com',
      });

    expect(res.status).toBe(200);
    expect(res.body).toContainKeys(['id', 'name', 'email']);
  });
});

describe('Destroy', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return error if the id does not exist', async () => {
    const token = await getToken();

    const res = await request(app)
      .delete('/deliverymans/5d68cs')
      .set('Authorization', `bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('should delete delivery man if it exist', async () => {
    const token = await getToken();

    const deliveryman = await factory.create('Deliveryman');

    const { id } = deliveryman.dataValues;

    const res = await request(app)
      .delete(`/deliverymans/${id}`)
      .set('Authorization', `bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
