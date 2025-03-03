const express = require("express");
const {
  createUserHandler,
  resentOtpHandler,
  verifyOtpHandler,
  getUserHandler,
  getUsersHandler,
  loginUserHandler,
  updateUserHandler,
  logOutUserHandler,
  deleteUserHandler,
  verifyEmailHandler
} = require("../../controllers/v1/userController");
const { validateUserToken } = require("../../middleware/auth");

const router = express.Router();

router.post("", createUserHandler);
router.get("/:id", validateUserToken(['buyer', 'seller', 'admin']), getUserHandler);
router.get("", getUsersHandler);
router.post("/resendotp", resentOtpHandler);
router.post("/verifyotp", verifyOtpHandler);
router.patch("/verify/:token", verifyEmailHandler);
router.post("/login", loginUserHandler);
router.put("/:id", validateUserToken(['buyer', 'seller', 'admin']), updateUserHandler);
router.post("/logout",  validateUserToken(['buyer', 'seller', 'admin']), logOutUserHandler);
router.delete("/:id", validateUserToken(['admin']), deleteUserHandler);

module.exports = router;
