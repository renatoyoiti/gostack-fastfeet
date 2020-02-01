import Sequelize, { Model } from 'sequelize';
import cryptoRandomString from 'crypto-random-string';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async deliveryman => {
      if (deliveryman) {
        deliveryman.id = cryptoRandomString({ length: 6 });
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Avatar, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Deliveryman;
