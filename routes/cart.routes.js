const express = require("express");
const router = express.Router();
const cart_controller = require("../controllers/cart.controller");
const { requireUserLogin } = require("../middlewares/requireLogin");

router.get("/user/cart", requireUserLogin, cart_controller.getCartDetails_get);
router.post(
  "/user/cart/product/:productId/:type",
  requireUserLogin,
  cart_controller.editProductInCart_post
);
router.get('/user/wishlist', requireUserLogin, cart_controller.getwishlistByUser)
router.post(
  '/user/wishlist/:productId/:type',
  requireUserLogin,
  cart_controller.addtoWishlist
)

router.post("/updatecart", requireUserLogin, cart_controller.updateCard)

module.exports = router;
