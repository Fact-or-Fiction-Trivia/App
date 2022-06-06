"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("users", "points", {
      defaultValue: 0,
      allowNull: false,
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("users", "points");
  },
};
