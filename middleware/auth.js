const config = require("../config/config");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlackListedToken = require('../models/BlackListedTokens')
// const {
//   blacklistedTokens,
//   isTokenBlacklisted,
// } = require("../controllers/v1/userController");

// blacklistedTokens;

const validateUserToken = (permissions = []) => {
  try {
    return async (req, res, next) => {
      if (!req.headers.authorization) {
        return res
          .status(401)
          .json({ message: "Authorization header not found" });
      }

      const token = req.headers.authorization.split(" ")[1];
      if (!token && token===BlackListedToken.blacklistedToken) {
        return res
          .status(401)
          .json({ message: "Invalid token or blacklisted token" });
      }

      const payload = jwt.verify(token, config.jwtSecret);
      if (!payload) {
        return res.status(401).json({ message: "Invalid user" });
      }

      const user = await User.findByPk(payload.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      if (!permissions.includes(req.user.role)) {
        return res.status(401).json({ message: "You don't have permission" });
      }
      next();
    };
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { validateUserToken };
