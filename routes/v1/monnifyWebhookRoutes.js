const express = require("express");
const webhook = require("../../controllers/v1/monnifyWebhook");
const { validateUserToken } = require("../../middleware/auth");

const router = express.Router();

router.post(
  "",
  validateUserToken(["admin", "buyer", "seller"]),
  webhook
);

module.exports = router;
