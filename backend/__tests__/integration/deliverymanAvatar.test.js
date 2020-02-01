import request from 'supertest';
import { resolve } from 'path';

import app from '../../src/app';
import truncate from '../utils/truncate';
import getToken from '../utils/returnToken';
import factory from '../factories';

describe('Create', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create an avatar with file upload and associate with deliveryman', async () => {
    const token = await getToken();

    const deliveryman = await factory.create('Deliveryman');

    const { id } = deliveryman.dataValues;

    const res = await request(app)
      .post(`/deliverymans/${id}/avatars`)
      .set('Authorization', `bearer ${token}`)
      .attach('file', resolve(__dirname, '..', 'assets', 'foto.png'));

    expect(res.status).toBe(200);
    expect(res.body).toContainKey('id');
  });
});
