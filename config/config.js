const dotenv = require("dotenv");

//loads the environmental varibles from the env file
dotenv.config();

config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    // dialectOptions: {
    //   ssl: {
    //     require: false,
    //     rejectUnauthorized: false
    //   }
    // }
  },
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtSecret2: process.env.JWT_SECRET_KEY2,
  email:{
    resetTokenEpiration: process.env.RESET_TOKEN_EXPIRATION,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    baseUrl: process.env.BASE_URL,
  },
  monnify:{
    apiKey: process.env.MONNIFY_API_KEY,
    secretKey: process.env.MONNIFY_SECRET_KEY,
    contractCode: process.env.MONNIFY_CONTRACT_CODE,
    baseUrl: process.env.MONNIFY_BASE_URL,
  }
};

module.exports = config;
