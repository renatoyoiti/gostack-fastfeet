import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Recipient from '../app/models/Recipient';
import User from '../app/models/User';
import Deliveryman from '../app/models/Deliveryman';
import Avatar from '../app/models/Avatar';
import Delivery from '../app/models/Delivery';

export const models = [Recipient, User, Deliveryman, Avatar, Delivery];

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
