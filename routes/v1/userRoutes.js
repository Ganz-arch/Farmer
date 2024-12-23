const express = require("express");
const {
  createUserHandler,
  getUserHandler,
  getUsersHandler,
  loginUserHandler,
  updateUserHandler,
  logOutUserHandler,
  deleteUserHandler,
} = require("../../controllers/v1/userController");
const { validateUserToken } = require("../../middleware/auth");

const router = express.Router();

router.post("", createUserHandler);
router.get("/:id", validateUserToken(['buyer', 'seller']), getUserHandler);
router.get("", getUsersHandler);
router.post("/login", loginUserHandler);
router.put("/:id", validateUserToken(['buyer', 'seller']), updateUserHandler);
router.post("/logout",  logOutUserHandler);
router.delete("/:id", validateUserToken(['admin']), deleteUserHandler);

module.exports = router;
