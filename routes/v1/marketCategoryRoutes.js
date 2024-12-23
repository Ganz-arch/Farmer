const express = require("express");
const {
    createMarketCategoryHandler,
    retrieveMarketCategoryHandler,
    retrieveMarketsCategoryHandler,
    updateMarketCategoryHandler,
    deleteMarketCategoryHandler,
} = require("../../controllers/v1/marketCategoryController");
const { validateUserToken } = require("../../middleware/auth");

const router = express.Router();

router.post("",validateUserToken(['admin']), createMarketCategoryHandler);
router.get("/:id", retrieveMarketCategoryHandler);
router.get("", retrieveMarketsCategoryHandler);
router.put("/:id", validateUserToken(['admin']), updateMarketCategoryHandler);
router.delete("/:id", validateUserToken(['admin']), deleteMarketCategoryHandler);

module.exports = router;
