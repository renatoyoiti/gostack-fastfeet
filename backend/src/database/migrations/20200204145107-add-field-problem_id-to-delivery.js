module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliveries', 'problem_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'delivery_problems', key: 'id' },
      onUpdate: 'CASCADE',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('deliveries', 'problem_id');
  },
};
