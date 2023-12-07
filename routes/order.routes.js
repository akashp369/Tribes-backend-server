const express = require("express");
const orderController = require("../controllers/order.controller");
const {
  requireUserLogin,
  requireAdminLogin,
} = require("../middlewares/requireLogin");
const router = express.Router();

router.post(
  "/user/order/place",
  requireUserLogin,
  orderController.placeOrder_post
);

// rzp
router.post(
  " ",
  requireUserLogin,
  orderController.createRzpOrder_post
);
router.post(
  "/rzp/payment-verification",
  requireUserLogin,
  orderController.rzpPaymentVerification
);

router.post(
  "/admin/order/:orderId/update",
  requireAdminLogin,
  orderController.updateOrder_post
);
router.get(
  "/admin/order/all",
  requireAdminLogin,
  orderController.getAllOrders_get
);
router.get('/admin/order/yearwise',
  requireAdminLogin,
  orderController.getYearWiseorder);
router.get(
  "/user/order/all",
  requireUserLogin,
  orderController.userPreviousOrders_get
);

// ccavenue routes
router.post(
  "/ccavenue-createOrder",
  requireUserLogin,
  orderController.ccavenue_creatOrder_post
);

router.post(
  "/ccavenuerequesthandler",
  requireUserLogin,
  orderController.ccavenuerequesthandler
);

router.post(
  "/ccavenueresponsehandler",
  // requireUserLogin,
  orderController.ccavenueresponsehandler
);

module.exports = router;
