/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  Op,
  models: { User, Question, Tag },
} = require("../db");

const { requireAdmin } = require("./middleware");

router.get("/questions", requireAdmin, async (req, res, next) => {
  try {
    res.json(await Question.findAll());
  } catch (err) {
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
module.exports = router;
