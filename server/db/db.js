const Sequelize = require("sequelize");
const config = require("./config");
const pkg = require("../package.json");

const getDB = (production) => {
  let db;
  if (production) {
    // Heroku provides DATABASE_URL as a connection string
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      db = new Sequelize(dbUrl, {
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: false,
      });
    } else {
      // Fallback to individual credentials if DATABASE_URL not available
      db = new Sequelize({
        database: config.database.name,
        username: config.database.username,
        password: config.database.password,
        host: config.database.host,
        port: config.database.port,
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: false,
      });
    }
  } else {
    db = new Sequelize(`postgres://localhost:5432/fof`, {
      logging: false,
    });
  }
  return db;
};

module.exports = getDB(process.env.NODE_ENV === "production");
