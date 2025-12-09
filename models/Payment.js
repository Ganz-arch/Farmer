const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const Payment = sequelize.define(
  "Payment",
  {
    paymentReference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    customerName: DataTypes.STRING,
    customerEmail: DataTypes.STRING,
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: "PENDING",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define relationship
Payment.belongsTo(User, { foreignKey: "userId" });

module.exports = Payment;
