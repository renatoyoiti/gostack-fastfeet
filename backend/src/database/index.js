import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Recipient from '../app/models/Recipient';
import User from '../app/models/User';
import Deliveryman from '../app/models/Deliveryman';

export const models = [Recipient, User, Deliveryman];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
