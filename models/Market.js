const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const MarketCategory = require("./MarketCategory");


const Market = sequelize.define(
  "Market",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeOfProduce: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regularPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    bulkPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryOption: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Market.belongsTo(MarketCategory);
Market.belongsTo(User);

module.exports = Market;
