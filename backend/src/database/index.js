import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Recipient from '../app/models/Recipient';
import User from '../app/models/User';
import Deliveryman from '../app/models/Deliveryman';
import Avatar from '../app/models/Avatar';
import Delivery from '../app/models/Delivery';
import Signature from '../app/models/Signature';

export const models = [
  Signature,
  Delivery,
  Recipient,
  User,
  Deliveryman,
  Avatar,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
