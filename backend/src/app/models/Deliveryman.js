import Sequelize, { Model } from 'sequelize';
import cryptoRandomString from 'crypto-random-string';
import { format } from 'date-fns';

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
        createdAt: {
          type: 'TIMESTAMP',
        },
        createDt: {
          type: Sequelize.VIRTUAL,
          get() {
            return format(this.createdAt, "yyyy-MM-dd'T'HH:mm:ssxxx");
          },
        },
      },
      {
        sequelize,
        tableName: 'deliverymen',
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
