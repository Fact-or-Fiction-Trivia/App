"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "users", // table name
        "username", // new field name
        {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
          validate: {
            is: /^[a-zA-Z0-9_]*$/g,
          },
        }
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn("users", "username")]);
  },
};
