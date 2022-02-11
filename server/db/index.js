//this is the access point for all things database related!
const { Op } = require("sequelize");
const db = require("./db");

const { User, Question, Tag, Streak, UserAnswered } = require("./models");

//User Submitted Questions
User.hasMany(Question);

//Streaks Table
Streak.belongsTo(User);
User.hasMany(Streak);

//UserAnswered Table
User.belongsToMany(Question, { through: UserAnswered });
Question.belongsToMany(User, { through: UserAnswered });

Streak.hasMany(UserAnswered);

Question.belongsToMany(Tag, { through: "question-tags" });
Tag.belongsToMany(Question, { through: "question-tags" });

module.exports = {
  db,
  Op,
  models: {
    User,
    Question,
    Tag,
    UserAnswered,
    Streak,
  },
};
