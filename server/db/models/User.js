const Sequelize = require("sequelize");
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 5;

const User = db.define("user", {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  fullName: {
    type: Sequelize.VIRTUAL,
    get() {
      if (!this.firstName || !this.lastName) {
        return "No Name";
      }
      const [firstF, ...restF] = this.firstName;
      const [firstL, ...restL] = this.lastName;
      return `${firstF.toUpperCase() + restF.join("")} ${
        firstL.toUpperCase() + restL.join("")
      }`;
    },
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
  },
  maxScore: {
    type: Sequelize.STRING,
    defaultValue: 0,
  },
  role: {
    type: Sequelize.ENUM("User", "Admin"),
    allowNull: false,
  },
  affiliation: {
    type: Sequelize.ENUM("Democrat", "Republican", "Independent", "Other"),
    allowNull: false,
  },
});

module.exports = User;

/**
 * instanceMethods
 */
User.prototype.correctPassword = function (candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT);
};

User.prototype.ownsAgent = async function (agentId) {
  const isOwner = await this.hasAgent(agentId);
  if (!isOwner)
    throw Error(`User with ID ${this.id}does not own Agent with ID ${agentId}`);
};

User.prototype.generateInviteId = function () {
  return jwt.sign({ id: this.id, timestamp: Date.now() }, process.env.JWT);
};

User.prototype.setMaxScore = async function (score) {
  if (score > this.maxScore) {
    await this.update({ maxScore: score });
  }
};

/**
 * classMethods
 */
User.authenticate = async function ({ email, password }) {
  const user = await this.findOne({ where: { email } });
  if (!user || !(await user.correctPassword(password))) {
    const error = Error("Incorrect email/password");
    error.status = 401;
    throw error;
  }
  return user.generateToken();
};

User.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(id);
    if (!user) {
      throw "nooo";
    }
    return user;
  } catch (ex) {
    const error = Error("bad token");
    error.status = 401;
    throw error;
  }
};

User.findByTokenOptional = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(id);
    if (!user) {
      throw "bad";
    }
    return user;
  } catch (ex) {
    return false;
  }
};

User.isAdmin = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(id);
    // console.log(user);
    if (!user) {
      throw "user does not exist";
    }
    if (user.role !== "Admin") {
      throw "unauthorized user";
    }
    return user;
  } catch (ex) {
    const error = Error("bad token");
    error.status = 401;
    throw error;
  }
};
User.validateInvitation = async function (inviteId) {
  try {
    const { id, timestamp } = await jwt.verify(inviteId, process.env.JWT);
    if (Date.now() - timestamp > 600000) {
      throw "Expired";
    }
    const user = await User.findByPk(id);
    if (!user) {
      throw "user does not exist";
    }
    return user;
  } catch (ex) {
    console.log(ex);
    const error = Error("bad token");
    error.status = 401;
    throw error;
  }
};

/**
 * hooks
 */
const hashPassword = async (user) => {
  // console.log("hello", user.changed("password"), user);
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)));
