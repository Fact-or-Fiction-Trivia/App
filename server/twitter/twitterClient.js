const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

console.log(
  process.env.TWITTER_API_KEY,
  process.env.TWITTER_API_KEY_SECRET,
  process.env.TWITTER_ACCESS_TOKEN,
  process.env.TWITTER_ACCESS_TOKEN_SECRET
);

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const rwClient = client.readWrite;

module.exports = rwClient;
