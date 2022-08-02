const { Question } = require("../db/models/index.js");
const rwClient = require("./twitterClient.js");
const { db } = require("../db");

// run through postman oauth flow with fact or fiction accounts to generate secret

const getQuestion = async () => {
  const question = await Question.findOne({
    order: db.random(),
  }).then((response) => {
    return response.text;
  });

  return question;
};

const tweet = async () => {
  try {
    const question = await getQuestion();
    await rwClient.v2.tweet(question, {
      poll: { duration_minutes: 180, options: ["fact 🤓", "fiction 🤡"] },
    });
    console.log("tweet successfully created");
  } catch (e) {
    console.error(e);
  }
};

tweet();
