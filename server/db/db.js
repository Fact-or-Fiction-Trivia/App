const Sequelize = require("sequelize");
const config = require("./config");
const pkg = require("../../package.json");

const getDB = (production) => {
  let db;
  if (production) {
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
    });
  } else {
    db = new Sequelize(`postgres://localhost:5432/${pkg.name}`, {
      logging: false,
    });
  }
  return db;
};

module.exports = getDB(process.env.NODE_ENV === "production");
