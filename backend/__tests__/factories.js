import faker from 'faker';
import { factory } from 'factory-girl';
import cryptoRandomString from 'crypto-random-string';

import User from '../src/app/models/User';
import Recipient from '../src/app/models/Recipient';
import Deliveryman from '../src/app/models/Deliveryman';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Recipient', Recipient, {
  name: faker.name.findName(),
  cep: '86709770',
  state: 'PR',
  city: 'Arapongas',
  neighborhood: 'Jardim Vale das Perobas',
  street: 'Rua Sabiá Branco',
  number: '341',
  complement: '',
});

factory.define('Deliveryman', Deliveryman, {
  name: faker.name.findName(),
  email: faker.internet.email(),
});

export default factory;
