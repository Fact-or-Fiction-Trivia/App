//this is the access point for all things database related!
const { Op } = require("sequelize");
const db = require("./db");

const {
  ContestedQuestion,
  User,
  Question,
  Tag,
  Streak,
  UserAnswered,
  Token,
} = require("./models");

User.hasOne(Token);
Token.belongsTo(User);

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

// ContestedQuestion Table
User.hasMany(ContestedQuestion);
Question.hasMany(ContestedQuestion);

ContestedQuestion.belongsTo(Question);

module.exports = {
  db,
  Op,
  models: {
    ContestedQuestion,
    Question,
    Streak,
    Tag,
    User,
    UserAnswered,
    Token,
  },
};
