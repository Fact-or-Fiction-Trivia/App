const Sequelize = require("sequelize");
const db = require("../db");

const Question = db.define("question", {
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  answer: {
    type: Sequelize.ENUM("Fact", "Fiction"),
    allowNull: false,
  },
  source: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  explanation: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  expiration: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM("Approved", "Denied", "Pending"),
    allowNull: false,
    defaultValue: "Pending",
  },
});

module.exports = Question;
