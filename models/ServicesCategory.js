const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ServicesCategory = sequelize.define(
  "ServicesCategory",
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

ServicesCategory.associate = (models) => {
  ServicesCategory.hasMany(models.Service);
};

module.exports = ServicesCategory;


