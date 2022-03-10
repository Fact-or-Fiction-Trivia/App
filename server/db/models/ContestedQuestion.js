const Sequelize = require("sequelize");
const db = require("../db");

const ContestedQuestion = db.define("contested-question", {
  issue: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  source: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM("Approved", "Denied", "Pending", "Withdrawn"),
    allowNull: false,
    defaultValue: "Pending",
  },
});

module.exports = ContestedQuestion;
