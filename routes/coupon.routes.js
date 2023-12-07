const express = require("express");
const couponController = require("../controllers/coupon.controller");
const { requireAdminLogin } = require("../middlewares/requireLogin");
const router = express.Router();

router.post(
  "/admin/coupon/add",
  requireAdminLogin,
  couponController.addCoupon_post
);
router.get("/coupon/:code/get", couponController.getParticularCoupon_get);
router.delete(
  "/admin/coupon/:_id/delete",
  requireAdminLogin,
  couponController.deleteCoupon_delete
);
router.post(
  "/admin/coupon/:_id/edit",
  requireAdminLogin,
  couponController.editCoupons_post
);
router.get("/coupon/all", couponController.getAllCoupons_get);

module.exports = router;
