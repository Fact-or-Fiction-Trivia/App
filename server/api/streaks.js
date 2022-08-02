/* eslint-disable no-unused-vars */
const router = require("express").Router();
const moment = require("moment");

const {
  Op,
  models: { User, Question, Streak, UserAnswered },
} = require("../db");

const { requireToken } = require("./middleware");

/**
 * GET/:id/
 * Get the highest streak for the user
 */

router.get("/", requireToken, async (req, res, next) => {
  try {
    res.json(req.user.maxScore);
  } catch (err) {
    next(err);
  }
});

/**
 * GET/all-scores/:id/
 * Get the highest streak for the user
 */

router.get("/all-scores/:id", requireToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    const week = await user.getStreaks({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf("week").toDate(),
        },
      },
      order: [["score", "DESC"]],
    });

    const month = await user.getStreaks({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf("month").toDate(),
        },
      },
      order: [["score", "DESC"]],
    });

    res.json({
      allTime: parseInt(user.maxScore),
      month: month[0]?.score || 0,
      week: week[0]?.score || 0,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /todays-high-score
 * Get the highest score for any user in the last day
 */

router.get("/todays-high-score", async (req, res, next) => {
  const userInfo = [
    {
      model: User,
      attributes: ["username"],
      where: {
        invisibleScore: false,
      },
    },
  ];

  const todaysScore = await Streak.findAll({
    where: {
      createdAt: {
        [Op.gte]: moment().startOf("day").toDate(),
      },
    },
    order: [["score", "DESC"]],
    include: userInfo,
  });

  res.json({ todaysHighestStreak: todaysScore[0] });
});

/**
 * GET/all-scores/
 * Get the highest 10-25 streaks all users per time period (week, month, all time)
 */

router.get("/all-scores", async (req, res, next) => {
  const userInfo = [
    {
      model: User,
      attributes: ["id", "username"],
      where: {
        invisibleScore: false,
      },
    },
  ];

  const returnHighestStreakOnly = (streaks) => {
    if (streaks.length === 0) return [];

    const filteredStreaks = [];
    streaks.forEach((streak) => {
      const existing = filteredStreaks.find(
        (s) => s.user.id === streak.user.id
      );
      if (existing) {
        if (streak.score > existing.score) {
          const index = filteredStreaks.indexOf(existing);
          filteredStreaks.splice(index, 1, streak);
        }
        // else do nothing
      } else {
        filteredStreaks.push(streak);
      }
    });

    return filteredStreaks;
  };

  try {
    const allTime = await Streak.findAll({
      order: [["score", "DESC"]],
      include: userInfo,
      limit: 11,
    }).then((streaks) => {
      return returnHighestStreakOnly(streaks);
    });

    const monthly = await Streak.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf("month").toDate(),
        },
      },
      order: [["score", "DESC"]],
      include: userInfo,
    }).then((streaks) => {
      return returnHighestStreakOnly(streaks);
    });

    const weekly = await Streak.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf("week").toDate(),
        },
      },
      order: [["score", "DESC"]],
      include: userInfo,
    }).then((streaks) => {
      return returnHighestStreakOnly(streaks);
    });

    const getAvgForAffiliation = async (affiliation, timePeriod) => {
      const userInfo = [
        {
          model: User,
          attributes: ["username"],
          where: {
            invisibleScore: false,
            affiliation,
          },
        },
      ];

      const allStreaks = await Streak.findAll({
        where: timePeriod && {
          createdAt: {
            [Op.gte]: moment().startOf(timePeriod).toDate(),
          },
        },
        order: [["score", "DESC"]],
        include: userInfo,
      }).then((streaks) => {
        if (streaks.length === 0) return 0;

        const users = {};
        for (let { userId, score } of streaks) {
          if (users[userId] && score < users[userId]) continue;

          users[userId] = score;
        }

        const allScores = Object.values(users);

        return Math.floor(
          allScores.reduce((a, b) => a + b, 0) / allScores.length
        );
      });

      return allStreaks;
    };

    const promises = await Promise.all([
      getAvgForAffiliation("Republican"),
      getAvgForAffiliation("Democrat"),
      getAvgForAffiliation("Independent"),
      getAvgForAffiliation("Republican", "month"),
      getAvgForAffiliation("Democrat", "month"),
      getAvgForAffiliation("Independent", "month"),
      getAvgForAffiliation("Republican", "week"),
      getAvgForAffiliation("Democrat", "week"),
      getAvgForAffiliation("Independent", "week"),
    ]);

    const teamScores = {
      allTime: {
        republican: promises[0],
        democrat: promises[1],
        independent: promises[2],
      },
      monthly: {
        republican: promises[3],
        democrat: promises[4],
        independent: promises[5],
      },
      weekly: {
        republican: promises[6],
        democrat: promises[7],
        independent: promises[8],
      },
    };

    res.json({
      allTime,
      monthly,
      weekly,
      teamScores,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /
 * Create streak with userAnswered questions
 */
router.post("/", requireToken, async (req, res, next) => {
  try {
    const answeredQuestions = [];

    // Get all of the question this user has answered previously
    // and store them into an array of ids
    const answeredQuestionIds = await User.findByPk(req.user.id, {
      include: [{ model: Question }],
    }).then(({ questions }) => questions.map(({ id }) => id));

    // Interate over each question in this streak
    for (const question of req.body) {
      // Check if this question has already been answered before
      const hasQuestion =
        answeredQuestionIds.findIndex((it) => it === question.questionId) !==
        -1;

      // If this question has not been answered before
      // add it to the answeredQuestions array
      if (!hasQuestion) {
        answeredQuestions.push(question);
      }
    }

    /**
     * The above code is required in the following case:
     * 1. Loggedin user answered questions 1,2,3 and saves
     * the streak into the database
     * 2. Non-loggedin user (Same person) starts playing in another browser
     * with different local storage
     * 3. Non-loggedin user answers questions 1,2,3 again and
     * signs into their account
     *
     * In this case the questions 1,2,3 have already been answered
     * and will cause an error in this route.
     *
     * So we check each question against the users answered questions
     * and filter out any that have already been answered.
     *
     * TODO: Need to alert user that their streak has been decreased
     * to account for duplicate answers.
     */
    let score =
      answeredQuestions.length === 0 ? 0 : answeredQuestions.length - 1;

    const streak = await Streak.create({ score, userId: req.user.id });

    for (const question of answeredQuestions) {
      await UserAnswered.create({
        ...question,
        userId: req.user.id,
        streakId: streak.id,
      });
    }

    res.json(score);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
