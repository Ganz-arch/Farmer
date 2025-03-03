const express = require("express");
const initiatePayment = require("../../controllers/v1/monnifyPaymentController");
const { validateUserToken } = require("../../middleware/auth");

const router = express.Router();

router.post(
  "",
  validateUserToken(["admin", "buyer", "seller"]),
  initiatePayment
);

module.exports = router;
