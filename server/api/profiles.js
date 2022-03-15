const router = require("express").Router();

const {
  models: { User },
} = require("../db");

const { requireToken } = require("./middleware");

// GET all contested questions
// filter by status - for the admin view

// TODO

// POST one contested question
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    res.json(await User.findByPk(userId));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
