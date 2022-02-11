/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
"use strict";
const app = require("./server");
const seed = require("./script/seed");
const { db } = require("./server/db");
const PORT = process.env.PORT || 8080;

const init = async () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      require("dotenv").config();
    }
    if (process.env.SEED === "TRUE") {
      await seed();
    } else {
      await db.sync();
    }
    console.log("Hello");
    app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
  } catch (ex) {
    console.log("Err", ex);
    // console.log(ex);
  }
};

init();
