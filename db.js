const { Sequelize } = require("sequelize");
const config = require("./config/config");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    port: config.development.port,
    dialect: "postgres",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
  console.log(
    "Loading Sequelize configuration for:",
    process.env.NODE_ENV || "development"
  );
})();

module.exports = sequelize;
