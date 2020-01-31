import request from 'supertest';

import app from '../../src/app';

export default async (token, recipientCep) => {
  const res = await request(app)
    .post('/ceps')
    .set('Authorization', `bearer ${token}`)
    .send({
      recipientCep,
    });

  const { ...address } = res.body;
  return address;
};
