/* eslint-disable no-unused-vars */
"use strict";

const {
  db,
  models: { User, Tag, Question, UserAnswered, Streak },
} = require("../db");

const csvParser = require("./csv");

async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  const { user_seed_data } = require("./seed_data");

  const myDB = {
    users: (() =>
      user_seed_data.map((user) => {
        const { f, l, r, a } = user;
        return {
          firstName: f,
          lastName: l,
          email: `${f + l}@factorfiction.com`,
          username: `${f + l}`,
          password: "12345678",
          role: r,
          affiliation: a,
        };
      }))(),
  };
  const { users } = myDB;

  //Create Users in Database
  const allUsers = await User.bulkCreate(users, {
    returning: true,
  });

  //Parse Questions from CSV
  const { rawQuestions, rawTags } = await csvParser();

  //Format Questions into Array of objects for creation
  const questions = Object.values(rawQuestions).map((question) => {
    const { text, answer, explanation, expiration, source, tags } = question;
    return { text, answer, explanation, source, status: "Approved" };
  });
  //Create Questions in Database
  const allQuestions = await Question.bulkCreate(questions, {
    returning: true,
  });

  //Format tags into Array of objects for creation
  const tags = [...rawTags].map((tag) => ({ name: tag }));
  //Create Tags in Database
  const allTags = await Tag.bulkCreate(tags, {
    returning: true,
  });

  //Reduce rawQuestions into an object to easily grab the tags assocaited to each question
  const questionTags = Object.values(rawQuestions).reduce(
    (tagsObj, question) => {
      const { text, tags } = question;
      tagsObj[text] = tags;
      return tagsObj;
    },
    {}
  );

  //Associate all tags to specific questions
  for (const question of allQuestions) {
    const { text } = question;
    const tags = questionTags[text];
    for (const tagName of tags) {
      const foundTag = allTags.find((tag) => {
        return tag.name === tagName;
      });
      if (foundTag) {
        await question.addTag(foundTag.id);
      }
    }
  }

  const [admin, user] = allUsers;
  const [one, two, three, four] = allQuestions;

  // //Create a UserAnswered as correct
  // const answered = await UserAnswered.create({
  //   answeredCorrectly: true,
  //   userId: user.id,
  //   questionId: one.id,
  // });
  // const answeredTwo = await UserAnswered.create({
  //   answeredCorrectly: true,
  //   userId: user.id,
  //   questionId: two.id,
  // });

  // //Create a streak and associate UserAnswered
  // const streak = await Streak.create({ score: 7, userId: user.id });
  // await streak.addUseranswered(answered);
  // const userMaxScore1 = await User.findByPk(user.id).then(
  //   ({ maxScore }) => maxScore
  // );

  // const streakTwo = await Streak.create({ score: 5, userId: user.id });
  // await streakTwo.addUseranswered(answeredTwo);

  // // const [max] = await Streak.findAll({
  // //   where: { userId: user.id },
  // //   order: [["score", "DESC"]],
  // // }).then((streaks) => streaks.map(({ score }) => score));
  // const userMaxScore2 = await User.findByPk(user.id).then(
  //   ({ maxScore }) => maxScore
  // );
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
