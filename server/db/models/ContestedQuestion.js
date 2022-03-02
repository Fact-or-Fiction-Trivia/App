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
});

module.exports = ContestedQuestion;
