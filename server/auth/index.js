const router = require("express").Router();
const pkg = require("../../package.json");
const {
  models: { User, Permission },
} = require("../db");
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    const token = await User.authenticate(req.body);
    res.cookie(`token-${pkg.name}`, token, { maxAge: 432000000 });
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = await User.authenticate(user);
    res.cookie(`token-${pkg.name}`, token, { maxAge: 432000000 });
    res.sendStatus(201);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.sendStatus(401).send("User already exists");
    } else {
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
