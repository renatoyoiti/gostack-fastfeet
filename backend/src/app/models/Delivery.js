import Sequelize, { Model } from 'sequelize';
import { format } from 'date-fns';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: Sequelize.INTEGER,
        deliveryman_id: Sequelize.STRING,
        signature_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        canceled_at: {
          type: Sequelize.DATE,
        },
        start_date: {
          type: Sequelize.DATE,
        },
        end_date: {
          type: Sequelize.DATE,
        },
        created_at: {
          type: Sequelize.DATE,
        },
        createDt: {
          type: Sequelize.VIRTUAL,
          get() {
            return format(this.created_at, "yyyy-MM-dd'T'HH:mm:ssxxx");
          },
        },
        startDt: {
          type: Sequelize.VIRTUAL,
          get() {
            return (
              this.start_date &&
              format(this.start_date, "yyyy-MM-dd'T'HH:mm:ssxxx")
            );
          },
        },
        endDt: {
          type: Sequelize.VIRTUAL,
          get() {
            return (
              this.end_date && format(this.end_date, "yyyy-MM-dd'T'HH:mm:ssxxx")
            );
          },
        },
        cancelDt: {
          type: Sequelize.VIRTUAL,
          get() {
            return (
              this.canceled_at &&
              format(this.canceled_at, "yyyy-MM-dd'T'HH:mm:ssxxx")
            );
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

    this.belongsTo(models.Signature, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Delivery;
