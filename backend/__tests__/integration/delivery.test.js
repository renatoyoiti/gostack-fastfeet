import request from 'supertest';

import app from '../../src/app';
import truncate from '../utils/truncate';
import getToken from '../utils/returnToken';
import factory from '../factories';

describe('Create', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create a new delivery', async () => {
    const token = await getToken();

    const deliveryman = await factory.create('Deliveryman');
    const recipient = await factory.create('Recipient');

    const { id: recipient_id } = recipient.dataValues;

    const { id } = deliveryman.dataValues;

    const res = await request(app)
      .post('/deliveries')
      .set('Authorization', `bearer ${token}`)
      .send({
        deliveryman_id: id,
        recipient_id,
        product: 'Monitor QLED',
      });

    expect(res.status).toBe(200);
    expect(res.body).toContainKeys(['id', 'recipient_id', 'deliveryman_id']);
  });
});

describe('List', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should list all deliveries', async () => {
    const token = await getToken();

    const deliveryman = await factory.create('Deliveryman');
    const recipient = await factory.create('Recipient');

    const { id: recipient_id } = recipient.dataValues;

    const { id } = deliveryman.dataValues;
    console.log(id);

    await request(app)
      .post('/deliveries')
      .set('Authorization', `bearer ${token}`)
      .send({
        deliveryman_id: id,
        recipient_id,
        product: 'Monitor QLED',
      });

    const res = await request(app)
      .get('/deliveries')
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

  it('should update a delivery', async () => {
    const token = await getToken();

    const deliveryman = await factory.create('Deliveryman');
    const recipient = await factory.create('Recipient');
    const delivery = await factory.create('Delivery', {
      recipient_id: recipient.dataValues.id,
      deliveryman_id: deliveryman.dataValues.id,
    });

    const { id } = delivery.dataValues;

    const res = await request(app)
      .put(`/deliveries/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        product: 'Esse não vai dar',
      });

    expect(res.status).toBe(200);
  });
});

describe('Destroy', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should delete an existent delivery', async () => {
    const token = await getToken();

    const deliveryman = await factory.create('Deliveryman');
    const recipient = await factory.create('Recipient');
    const delivery = await factory.create('Delivery', {
      recipient_id: recipient.dataValues.id,
      deliveryman_id: deliveryman.dataValues.id,
    });

    const { id } = delivery.dataValues;

    const res = await request(app)
      .delete(`/deliveries/${id}`)
      .set('Authorization', `bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should return error while trying to delete an inexistent delivery', async () => {
    const token = await getToken();

    const res = await request(app)
      .delete('/deliveries/9999999')
      .set('Authorization', `bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toContainKey('error');
  });
});
