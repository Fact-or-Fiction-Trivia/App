/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  db,
  Op,
  models: { User, Question, Tag, ContestedQuestion },
} = require("../db");

const { requireAdmin } = require("./middleware");

router.get("/questions", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.query;
    if (status) {
      const questions = await db.query(
        `SELECT questions.id, questions.text, questions.answer, questions.source, questions.explanation, questions.author, users.username, users.email, users.affiliation FROM questions JOIN users ON questions.author = users.id WHERE status='${status}'`
      );

      res.json(questions[0]); // the response here includes an array with more than what we want
    } else {
      res.json(
        await Question.findAll({
          where: { status: { [Op.notIn]: ["Pending", "Withdrawn", "Denied"] } },
        })
      );
    }
  } catch (err) {
    next(err);
  }
});

router.get("/contested-questions", requireAdmin, async (req, res, next) => {
  try {
    res.json(
      await ContestedQuestion.findAll({
        include: [User, Question],
        where: { status: "Pending" },
      })
    );
  } catch (err) {
    next(err);
  }
});

router.put(
  "/contested-questions/:contestedQuestionId",
  requireAdmin,
  async (req, res, next) => {
    try {
      const { contestedQuestionId } = req.params;
      const contestedQuestion = await ContestedQuestion.findByPk(
        contestedQuestionId,
        { include: [User, Question] }
      );
      await contestedQuestion.update(req.body);
      if (req.body.status === "Approved") {
        console.log("SEND EMAIL");
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /review_count
 * Get the number of questions with status = pending
 */
router.get("/review_count", requireAdmin, async (req, res, next) => {
  try {
    res.json(await Question.count({ where: { status: "Pending" } }));
  } catch (err) {
    res.send(err);
    next(err);
  }
});

router.get("/questions/:questionId", requireAdmin, async (req, res, next) => {
  try {
    const { questionId } = req.params;
    res.json(await Question.findByPk(questionId, { include: [Tag] }));
  } catch (err) {
    next(err);
  }
});

router.put("/questions/:questionId", requireAdmin, async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { questionData, questionTagIds } = req.body;

    const question = await Question.findByPk(questionId, { include: [Tag] });

    const currentTagIds = await question
      .getTags()
      .then((tags) => tags.map(({ id }) => id));

    const newTagSet = new Set(questionTagIds);

    for (const tagId of currentTagIds) {
      if (!newTagSet.has(tagId)) {
        await question.removeTag(tagId);
      }
    }

    await question.addTags(questionTagIds);

    await question.update(questionData);
    res.json(await Question.findByPk(questionId, { include: [Tag] }));
  } catch (err) {
    next(err);
  }
});

router.post("/questions", requireAdmin, async (req, res, next) => {
  try {
    const { questionData, questionTagIds } = req.body;
    const question = await Question.create(questionData);

    await question.addTags(questionTagIds);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.put("/user/:userId/score", requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (req.body.positive) {
      await user.update({ points: user.points + 1 });
    } else {
      await user.update({ points: user.points - 1 });
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
module.exports = router;
