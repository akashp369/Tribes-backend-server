const express = require("express");
const { requireAdminLogin } = require("../middlewares/requireLogin");
const productColorController = require("../controllers/product_color.controller");
const router = express.Router();

router.post(
  "/product/color/add",
  requireAdminLogin,
  productColorController.addColor_post
);
router.get("/product/color/all", productColorController.allColor_get);

module.exports = router;
