/* eslint-disable no-unused-vars */
const router = require("express").Router();
const getBase = require("../utils/getBase");

const mailer = require("../../mailer/email");
const {
  Op,
  models: { User, Permission, Token },
} = require("../db");
module.exports = router;

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

// router.put("/register", async (req, res, next) => {
//   try {
//     const { password, firstName, lastName, id } = req.body;
//     const user = await User.findByPk(id);

//     await user.update(
//       { password, firstName, lastName, status: "Active" },
//       { where: { id }, include: [Permission] }
//     );

//     const token = await user.generateToken();
//     res.cookie("token", token, { maxAge: 8640000 });
//     res.json(201);
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/request-reset", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    const [token, created] = await Token.findOrCreate({
      where: { userId: user.id },
      defaults: {
        token: crypto.randomBytes(32).toString("hex"),
      },
    });

    const text = `Reset password link: ${getBase()}password-reset/${user.id}/${
      token.token
    }`;
    const message = await mailer({
      to: email,
      subject: "Reset Password",
      text,
    });
    res.send(message);
  } catch (err) {
    next(err);
  }
});

router.post("/password-reset/:userId/:token", async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const { password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      throw "invalid link or expired";
    }

    const foundToken = await Token.findOne({
      where: { userId, token },
    });
    if (!foundToken) {
      throw "invalid link or expired";
    }

    await user.update({ password });

    await foundToken.destroy();

    res.send("reset");
  } catch (err) {
    next(err);
  }
});

router.delete("/:userId", requireAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params;
    await User.destroy({ where: { id: userId } });
    const users = await User.findAll({
      where: { role: { [Op.not]: "Admin" } },
      include: [Permission],
    });
    res.json(users);
  } catch (ex) {
    next(ex);
  }
});

router.put("/changeEmail/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { email, password } = req.body;

    const userCheck = await User.findByPk(userId);

    if (!userCheck || !(await userCheck.correctPassword(password))) {
      const error = Error("Incorrect email/password");
      error.status = 401;
      throw error;
    }

    await userCheck.update({ email }, { where: { id: userId } });
    const user = await User.findByPk(userId);
    const token = await user.generateToken();
    res.cookie("token", token, { maxAge: 8640000 });
    res.json(201);
  } catch (err) {
    next(err);
  }
});
