const router = require("express").Router();
const pkg = require("../../package.json");
const { requireToken } = require("../api/middleware");
const {
  models: { User, Permission, Token },
} = require("../db");
const resetPasswordEmail = require("../sendGrid/resetPassword");
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    const token = await User.authenticate(req.body);
    res.cookie(`token-${pkg.name}`, token, { maxAge: 432000000 });
    res.sendStatus(201);
  } catch (err) {
    if (err.message === "Incorrect email/password") {
      res.status(401).send("Incorrect email/password");
    } else {
      next(err);
    }
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = await user.generateToken();

    res.cookie(`token-${pkg.name}`, token, { maxAge: 432000000 });
    res.sendStatus(201);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      res.send(err);
      next(err);
    }
  }
});

router.put("/register", async (req, res, next) => {
  try {
    const { password, firstName, lastName, id } = req.body;
    let toUpdate = await User.findByPk(id);

    await toUpdate.update(
      { password, firstName, lastName, status: "Active" },
      { where: { id }, include: [Permission] }
    );
    const user = await User.findByPk(id);
    const token = await user.generateToken();
    res.cookie(`token-${pkg.name}`, token, { maxAge: 432000000 });
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    res.json(await User.findByToken(req.cookies[`token-${pkg.name}`]));
  } catch (ex) {
    next(ex);
  }
});

router.post("/request-reset", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email }, include: [Token] });

    if (!user) {
      res.sendStatus(404);
    } else {
      if (user.token) {
        await user.token.destroy();
      }
      const token = await Token.create({ userId: user.id });
      console.log(email);
      resetPasswordEmail({
        to: email,
        accessToken: token.accessToken,
      });

      res.json(200);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/tokens", async (req, res, next) => {
  try {
    const { accessToken } = req.query;
    const token = await Token.findOne({ where: { accessToken } });

    if (!token || token.hasExpired) {
      if (token && token.hasExpired) {
        await token.destroy();
      }
      const error = Error("Invalid token");
      error.status = 401;
      throw error;
    }
    res.json(token.userId);
  } catch (err) {
    next(err);
  }
});

router.put("/password-reset/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;
    const user = await User.findByPk(userId, { include: [Token] });
    if (user.token) {
      await user.token.destroy();
    }
    await user.update({ password });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/password-reset-logged-in",
  requireToken,
  async (req, res, next) => {
    try {
      await req.user.update(req.body);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/logout", async (req, res, next) => {
  try {
    let cookie = req.cookies[`token-${pkg.name}`];
    if (cookie === undefined) {
      console.log("No Cookie Destroyed");
    } else {
      res.cookie(`token-${pkg.name}`, "", { maxAge: 0 });
      console.log("Cookie Destroyed");
    }
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});
