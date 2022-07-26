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
  hasExpired: {
    type: Sequelize.VIRTUAL,
    get() {
      return this.expiration === null ? false : Date.now() > this.expiration;
    },
  },
  expiresIn: {
    type: Sequelize.VIRTUAL,
    get() {
      if (this.expiration === null) return undefined;
      const futureDate = new Date(this.expiration);
      const today = new Date();
      const days = Math.ceil((futureDate - today) / (1000 * 60 * 60 * 24));
      return days;
    },
  },
  status: {
    type: Sequelize.ENUM("Approved", "Denied", "Pending", "Withdrawn"),
    allowNull: false,
    defaultValue: "Pending",
  },
  author: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

module.exports = Question;
