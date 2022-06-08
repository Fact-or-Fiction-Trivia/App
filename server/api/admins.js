/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  Op,
  models: { User, Question, Tag, ContestedQuestion },
} = require("../db");

const { requireAdmin } = require("./middleware");

router.get("/users", requireAdmin, async (req, res, next) => {
  try {
    const { searchTerm } = req.query;

    if (searchTerm !== "undefined") {
      res.json(
        await User.findAll({
          where: {
            [Op.or]: {
              username: {
                [Op.regexp]: `(?i)${searchTerm}`,
              },
              email: {
                [Op.regexp]: `(?i)${searchTerm}`,
              },
              firstName: {
                [Op.regexp]: `(?i)${searchTerm}`,
              },
              lastName: {
                [Op.regexp]: `(?i)${searchTerm}`,
              },
            },
          },
        })
      );
    } else {
      res.json(await User.findAll());
    }
  } catch (err) {
    next(err);
  }
});

router.put("/users/:userId", requireAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params;
    await User.update(req.body, { where: { id: userId } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.get("/questions", requireAdmin, async (req, res, next) => {
  try {
    const { status, searchTerm } = req.query;
    if (status) {
      res.json(await Question.findAll({ where: { status } }));
    } else {
      if (searchTerm !== "undefined") {
        res.json(
          await Question.findAll({
            where: {
              [Op.and]: {
                status: { [Op.notIn]: ["Pending", "Withdrawn"] },
                [Op.or]: {
                  text: {
                    [Op.regexp]: `(?i)${searchTerm}`,
                  },
                  source: {
                    [Op.regexp]: `(?i)${searchTerm}`,
                  },
                  explanation: {
                    [Op.regexp]: `(?i)${searchTerm}`,
                  },
                },
              },
            },
          })
        );
      } else {
        res.json(
          await Question.findAll({
            where: { status: { [Op.notIn]: ["Pending", "Withdrawn"] } },
          })
        );
      }
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
