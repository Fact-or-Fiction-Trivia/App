/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
"use strict";
const app = require(".");
const seed = require("./script/seed");
const { db } = require("./db");
const PORT = process.env.PORT || 8080;

const init = async () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      require("dotenv").config();
    }

    // Start server first, then sync DB
    app.listen(PORT, () => console.log(`Serving on port ${PORT}`));

    // Attempt DB connection with timeout
    if (process.env.SEED === "TRUE") {
      await seed();
    } else {
      console.log("Attempting database sync...");
      await Promise.race([
        db.sync(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('DB sync timeout after 30s')), 30000)
        )
      ]);
      console.log("Database synced successfully");
    }
  } catch (ex) {
    console.error("Error during init:", ex.message || ex);
    console.error("Server is running but DB sync failed. Check database credentials.");
    // Server stays running even if DB fails
  }
};

init();
