const express = require("express");
const {
    createServiceCategoryHandler,
  retrieveServiceCategoryHandler,
  retrieveServiceCategoriesHandler,
  updateServiceCategoryHandler,
  deleteServiceCategoryHandler,
} = require("../../controllers/v1/servicesCatergoryController");
const { validateUserToken } = require("../../middleware/auth");

const router = express.Router();

router.post("",validateUserToken(['admin']), createServiceCategoryHandler);
router.get("/:id", retrieveServiceCategoryHandler);
router.get("", retrieveServiceCategoriesHandler);
router.put("/:id", validateUserToken(['admin']), updateServiceCategoryHandler);
router.delete("/:id", validateUserToken(['admin']), deleteServiceCategoryHandler);

module.exports = router;

