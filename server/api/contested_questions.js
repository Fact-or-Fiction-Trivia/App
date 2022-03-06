const router = require("express").Router();

const {
  models: { ContestedQuestion },
} = require("../db");

const { requireToken } = require("./middleware");

// GET all contested questions
// filter by status - for the admin view

// TODO

// POST one contested question
router.post("/", requireToken, async (req, res, next) => {
  try {
    const { issue, questionId, source } = req.body;
    await ContestedQuestion.create({
      issue,
      questionId,
      source,
      userId: req.user.id,
    });

    res.send({ status: 200 });
  } catch (err) {
    next(err);
  }
});

// GET all contested questions by user

// TODO

// PUT one contested question (update)

// TODO

module.exports = router;
