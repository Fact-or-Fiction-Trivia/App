/* eslint-disable no-unused-vars */
const {
  Op,
  models: { User, Agent, Transaction, Client },
} = require("../db");
const pkg = require("../../package.json");

const requireAdmin = async (req, res, next) => {
  try {
    req.user = await User.isAdmin(req.cookies[`token-${pkg.name}`]);
    next();
  } catch (e) {
    next(e);
  }
};

const requireToken = async (req, res, next) => {
  try {
    req.user = await User.findByToken(req.cookies[`token-${pkg.name}`]);
    next();
  } catch (e) {
    next(e);
  }
};

const requireTokenOptional = async (req, res, next) => {
  try {
    req.user = await User.findByTokenOptional(req.cookies[`token-${pkg.name}`]);
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  requireAdmin,
  requireToken,
  requireTokenOptional,
};
