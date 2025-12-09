const express = require("express");
const {createPayment, verifyPayment} = require("../../controllers/v1/monnifyPaymentController");
const { validateUserToken } = require("../../middleware/auth");

const router = express.Router();

router.post(
  "/initiate_payment",
  validateUserToken(["admin", "buyer", "seller"]),
  createPayment
);

router.post(
  "/verify_payment",
  validateUserToken(["admin", "buyer", "seller"]),
  verifyPayment
);

module.exports = router;
