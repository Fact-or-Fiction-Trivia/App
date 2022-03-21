const Sequelize = require("sequelize");
const db = require("../db");
const crypto = require("crypto");

const Token = db.define("token", {
  accessToken: {
    type: Sequelize.TEXT,
    allowsNull: false,
  },
  expires: {
    type: Sequelize.DATE,
  },
  hasExpired: {
    type: Sequelize.VIRTUAL,
    get() {
      return Date.now() > this.expires;
    },
  },
});

module.exports = Token;

/**
 * hooks
 */
const hashToken = (token) => {
  token.accessToken = crypto.randomBytes(48).toString("hex");
  //Expires in 10 minutes
  token.expires = Date.now() + 600000;
};

Token.beforeCreate(hashToken);
Token.beforeBulkCreate((tokens) => Promise.all(tokens.map(hashToken)));
