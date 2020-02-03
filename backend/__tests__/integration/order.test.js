import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../utils/truncate';
import { getDeliveryToken } from '../utils/returnToken';

describe('List', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should an array with all orders for logged deliveryman', async () => {
    const { token, deliveryman } = await getDeliveryToken();

    const { dataValues: recipient } = await factory.create('Recipient');
    const { dataValues: delivery } = await factory.create('Delivery', {
      recipient_id: recipient.id,
      deliveryman_id: deliveryman.id,
    });
    await factory.create('Delivery', {
      recipient_id: recipient.id,
      deliveryman_id: deliveryman.id,
    });
    await factory.create('Delivery', {
      recipient_id: recipient.id,
      deliveryman_id: deliveryman.id,
    });

    const res = await request(app)
      .get(`/deliverymans/${deliveryman.id}/deliveries`)
      .set('Authorization', `bearer ${token}`)
      .query('page=1');

    expect(delivery).toBeDefined();
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({})])
    );
  });
});
