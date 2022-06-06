/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  Op,
  models: { User, Permission, Token },
} = require("../db");

const { requireToken } = require("./middleware");

const requireAdmin = async (req, res, next) => {
  try {
    req.user = await User.isAdmin(req.cookies.token, { include: [Permission] });
    next();
  } catch (e) {
    next(e);
  }
};

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: { role: { [Op.not]: "Admin" } },
      include: [Permission],
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.put("/", requireToken, async (req, res, next) => {
  try {
    await User.update(req.body, { where: { id: req.user.id } });
    const user = await User.findOne({ where: { id: req.user.id } });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

/*
 * DELETE your own account
 * Account ID must match the logged in user
 */

router.put("/:userId", requireToken, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user || !(await user.correctPassword(req.body.password))) {
      const error = Error("Incorrect email/password");
      error.status = 401;
      throw error;
    } else {
      await User.destroy({ where: { id: req.user.id } });
      res.send({ success: 200 });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
