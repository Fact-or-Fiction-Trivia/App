const Sequelize = require("sequelize");
const db = require("../db");

const UserAnswered = db.define("useranswered", {
  answeredCorrectly: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = UserAnswered;
