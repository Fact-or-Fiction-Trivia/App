const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./User");

const Streak = db.define("streak", {
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
module.exports = Streak;

/**
 * hooks
 */
const storeHighestScore = async (streak) => {
  const { score, userId } = streak;
  const user = await User.findByPk(userId, { returning: true });
  await user.setMaxScore(score);
  return streak;
};
Streak.beforeCreate(storeHighestScore);
