const fs = require("fs");
const { parse } = require("csv-parse");

async function parseData(data) {
  return new Promise((resolve, reject) => {
    parse(data, { columns: false, trim: true }, function (err, rows) {
      if (err) reject(err);
      //Hash Map and Set to store parsed data
      const rawQuestions = {},
        rawTags = new Set();
      //Iterate through rows starting at index 1 to avoid the column titles
      for (let i = 1; i < rows.length; i++) {
        //Pull column data out of each row and split tags by comma
        const [tagsWithComma, text, answer, source, explanation, expiration] =
            rows[i],
          tags = tagsWithComma.split(", ");
        //Add tags of each row into rawTags Set
        rawTags.add(...tags);
        //Add question data into rawQuestions hash map with i as key
        rawQuestions[i] = {
          tags,
          text,
          answer,
          source,
          explanation,
          expiration,
        };
      }
      //return rawQuestions and rawTags to be parsed further in seed.js
      resolve({ rawQuestions, rawTags });
    });
  });
}

async function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/questions.csv", async function (err, fileData) {
      if (err) reject(err);
      resolve(await parseData(fileData));
    });
  });
}

module.exports = async () => await readFile();
