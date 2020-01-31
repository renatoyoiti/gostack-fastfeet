import request from 'supertest';

import app from '../../src/app';
import truncate from '../utils/truncate';
import getToken from '../utils/returnToken';

describe('Cep', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return an error if the cep provided contains special characters', async () => {
    const token = await getToken();

    const res = await request(app)
      .post('/ceps')
      .set('Authorization', `bearer ${token}`)
      .send({
        recipientCep: '8670-770',
      });

    expect(res.status).toBe(400);
  });

  it('should return an error if the cep provided cannot be found', async () => {
    const token = await getToken();

    const res = await request(app)
      .post('/ceps')
      .set('Authorization', `bearer ${token}`)
      .send({
        recipientCep: '56980654',
      });

    expect(res.status).toBe(400);
  });

  it('should return an error if the cep provided was not found', async () => {
    const token = await getToken();

    const res = await request(app)
      .post('/ceps')
      .set('Authorization', `bearer ${token}`)
      .send({
        recipientCep: '56982138',
      });

    expect(res.status).toBe(400);
  });

  it('should return address data with provided cep', async () => {
    const token = await getToken();

    const cepRes = await request(app)
      .post('/ceps')
      .set('Authorization', `bearer ${token}`)
      .send({
        recipientCep: '86709770',
      });

    expect(cepRes.status).toBe(200);
    expect(cepRes.body).toContainAllKeys([
      'cep',
      'neighborhood',
      'street',
      'state',
      'city',
    ]);
  });
});
