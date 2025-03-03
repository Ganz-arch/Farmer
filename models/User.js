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
    fullName: {
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
    isVerified:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    phoneNo: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmPassword: {
      type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    passwordResetToken: {
      type: DataTypes.STRING,
      unique: true,
    },
    passwordResetTokenCreatedAt:{
      type: DataTypes.DATE,
    },
    passwordResetTokenExpiresAt:{
      type: DataTypes.DATE,
    }
  },
  {
    defaultScope:{
      attributes:{exclude:['confirmPassword']} //Excludes confirm password by default
    }
  },
  {
    timestamps: true,
  }
);

User.associate = (models) => {
  User.hasMany(models.Market,models.Services)
};
module.exports = User;
