const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const { blacklistedTokens } = require("../controllers/v1/userController");

const BlackListedToken = sequelize.define(
  "BlackListedToken",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    blacklistedToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  },
  { timestamps: true }
);

module.exports = BlackListedToken;