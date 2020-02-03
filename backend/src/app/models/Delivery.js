import Sequelize, { Model } from 'sequelize';
import { format, parseISO } from 'date-fns';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: Sequelize.INTEGER,
        deliveryman_id: Sequelize.STRING,
        product: Sequelize.STRING,
        canceled_at: {
          type: 'TIMESTAMP',
        },
        start_date: {
          type: 'TIMESTAMP',
        },
        end_date: {
          type: 'TIMESTAMP',
        },
        createdAt: {
          type: 'TIMESTAMP',
        },
        date: {
          type: Sequelize.VIRTUAL,
          get() {
            return format(this.createdAt, 'dd/MM/yy');
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });

    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
  }
}

export default Delivery;
