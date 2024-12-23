const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNo: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    
  },
  
  {
    timestamps: true,
  }
);

User.associate = (models) => {
  User.hasMany(models.MarketCategory), User.hasMany(models.ServicesCategory);
};
module.exports = User;
