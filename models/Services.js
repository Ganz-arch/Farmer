const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const ServicesCategory = require("./ServicesCategory");

const Services = sequelize.define(
  "Service",
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
    typeOfService: {
      type: DataTypes.STRING,
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
    serviceOption: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    timestamps: true,
  }
);

Services.belongsTo(ServicesCategory);
Services.belongsTo(User);

module.exports = Services;
