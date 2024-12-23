const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const MarketCategory = sequelize.define(
  "MarketCategory",
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
  },
  {
    timestamps: true,
  }
);

MarketCategory.associate = (models) => {
  MarketCategory.hasMany(models.Market);
};

module.exports = MarketCategory;


