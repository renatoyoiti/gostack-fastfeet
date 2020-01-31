import request from 'supertest';

import app from '../../src/app';
import truncate from '../utils/truncate';
import getToken from '../utils/returnToken';
import getAddress from '../utils/returnAddress';
import factory from '../factories';

describe('Store', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return an error if the values are not properly provided', async () => {
    const token = await getToken();
    const { cep, street, neighborhood, city, state } = await getAddress(
      token,
      '86709770'
    );

    const res = await request(app)
      .post('/recipients')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Constantino da Silva',
        cep,
        street,
        neighborhood,
        city,
        state,
        complement: '',
      });

    expect(res.status).toBe(400);
  });

  it('should create a recipient with valid values', async () => {
    const token = await getToken();
    const { cep, street, neighborhood, city, state } = await getAddress(
      token,
      '86709770'
    );

    const res = await request(app)
      .post('/recipients')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Constantino da Silva',
        cep,
        street,
        neighborhood,
        city,
        state,
        complement: '',
        number: '341',
      });

    expect(res.status).toBe(200);
    expect(res.body).toContainKey('id');
  });
});

describe('List', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should list all recipients', async () => {
    const token = await getToken();
    await factory.create('Recipient');
    await factory.create('Recipient');

    const res = await request(app)
      .get('/recipients')
      .set('Authorization', `bearer ${token}`)
      .query('page=1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  });

  it('should return empty array if theres no data in database', async () => {
    const token = await getToken();

    const res = await request(app)
      .get('/recipients')
      .set('Authorization', `bearer ${token}`)
      .query('page=100');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([]));
  });
});

describe('Update', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should update recipient', async () => {
    const token = await getToken();
    const recipient = await factory.create('Recipient');

    const res = await request(app)
      .put(`/recipients/${recipient.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Mariazinha',
      });

    expect(res.status).toBe(200);
  });

  it('should return error while trying to update non existent recipient', async () => {
    const token = await getToken();

    const res = await request(app)
      .put('/recipients/659')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Mariazinha',
      });

    expect(res.status).toBe(400);
    expect(res.body).toContainKey('error');
  });
});
