/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  models: { Tag },
} = require("../db");

/**
 * GET /
 * All tags
 */

router.get("/", async (req, res, next) => {
  try {
    res.json(await Tag.findAll());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
