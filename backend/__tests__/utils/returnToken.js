import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';

export const getDeliveryToken = async () => {
  const { id } = await factory.create('Deliveryman', {
    name: 'Joaquino',
  });

  const res = await request(app)
    .post('/sessions/deliverymans')
    .send({ id });

  return res.body;
};

export default async () => {
  const { email, password } = await factory.create('User', {
    email: 'admin@fastfeet.com',
    password: '123456',
  });

  const res = await request(app)
    .post('/sessions')
    .send({
      email,
      password,
    });

  const { token } = res.body;

  return token;
};
