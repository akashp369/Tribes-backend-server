const mongoose = require("mongoose");
const User_Cart = mongoose.model("User_Cart");
const Product = mongoose.model("Product");
const {
  errorRes,
  internalServerError,
  successRes,
} = require("../utility/index");

module.exports.getCartDetails_get = (req, res) => {
  const { _id } = req.user;
  User_Cart.findOne({ user: _id })
    .populate(
      "products.product",
      "_id displayName brand_title color price product_category displayImage availability"
    )
    .then(cart => successRes(res, { cart }))
    .catch(err => internalServerError(res, err));
};

module.exports.editProductInCart_post = async (req, res) => {
  const { _id } = req.user;
  const { productId, type } = req.params;

  if (!productId) return errorRes(res, 400, "Invalid product Id. or no price varient");
  if (type != "add" && type != "subtract" && type != "delete")
    return errorRes(
      res,
      400,
      "Request type can be - 'add', 'subtract' or 'delete'."
    );

  try {
    const cart = await User_Cart.findOne({ user: _id });
    if (!cart)
      return errorRes(res, 400, "Internal server error. Please try again.");

    const productIndex = cart.products.findIndex(p => (p.product == productId));

    if (productIndex > -1) {
      if (type === "add") {
        const existingProduct = await Product.findById(productId);
        if (!existingProduct)
          return errorRes(
            res,
            404,
            "Product for which you are trying to update quantity does not exist."
          );

        if (
          existingProduct.availability >=
          cart.products[productIndex].quantity + 1
        )
          cart.products[productIndex].quantity++;
        else
          return errorRes(
            res,
            404,
            `Quantity for "${existingProduct.displayName}" cannot be more than ${existingProduct.availability}`
          );

        // cart.products[productIndex].quantity++
      } else if (type === "subtract") {
        if (cart.products[productIndex].quantity >= 2)
          cart.products[productIndex].quantity--;
        else cart.products.splice(productIndex, 1);
      } else {
        cart.products.splice(productIndex, 1);
      }
    } else {
      if (type === "add")
        cart.products.push({ product: productId, quantity: 1});
      else return errorRes(res, 400, "Product does not exist in cart.");
    }

    await cart
      .save()
      .then(updatedCart => {
        updatedCart
          .populate([
            {
              path: "products.product",
              select:
                "_id displayName brand_title color price product_category displayImage availability",
            },
            { path: "user", select: "displayName email" },
          ])
          .then(result =>
            successRes(res, {
              cart: result,
              message: "Cart updated successfully.",
            })
          );
      })
      .catch(err => internalServerError(res, err));
  } catch (err) {
    internalServerError(res, err);
  }
};
