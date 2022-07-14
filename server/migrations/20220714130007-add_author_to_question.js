"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("questions", "author", Sequelize.INTEGER);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("questions", "author");
  },
};
