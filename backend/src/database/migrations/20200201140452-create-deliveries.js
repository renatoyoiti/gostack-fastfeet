module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliveries', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      deliveryman_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      canceled_at: {
        type: 'TIMESTAMP',
        allowNull: true,
        defaultValue: null,
      },
      start_date: {
        type: 'TIMESTAMP',
        allowNull: true,
        defaultValue: null,
      },
      end_date: {
        type: 'TIMESTAMP',
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('deliveries');
  },
};
