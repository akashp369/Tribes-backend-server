const mongoose = require("mongoose");
const User_Cart = mongoose.model("User_Cart");
const User_WishlistDB = require("../models/wishlist.Model");
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
      "_id displayName brand_title color price product_category displayImage availability priceVarient"
    )
    .then((cart) => successRes(res, { cart }))
    .catch((err) => internalServerError(res, err));
};

module.exports.updateCard = async (req, res) => {
  try {
    const { _id } = req.user;
    const cart = await User_Cart.findOne({ user: _id });
    cart.products = [];
    await cart.save();
    successRes(res, { message: "Cart Update Done." });
  } catch (error) {
    internalServerError(res, error.message)
  }
}

module.exports.editProductInCart_post = async (req, res) => {
  const { _id } = req.user;
  const { productId, type } = req.params;
  const { variant, varientPrice } = req.body;
  if (type != "add" && type != "subtract" && type != "delete" && type != "modify")
    return errorRes(
      res,
      400,
      "Request type can be - 'add', 'subtract', modify or 'delete'."
    );
  try {
    const cart = await User_Cart.findOne({ user: _id });
    if (!cart) {
      return errorRes(res, 400, "Internal server error. Please try again.");
    }
    if (productId == 'undefined' || productId == ":productId" || productId == null) {
      for (let i = cart.products.length - 1; i >= 0; i--) {
        const productId = cart.products[i].product;
        if (!productId) {
          cart.products.splice(i, 1);
        } else {
          const existingProduct = await Product.findById(productId);
          if (!existingProduct) {
            cart.products.splice(i, 1);
          }
        }
      }
    } else {
      const findProduct = await Product.findById(productId);
      if (!findProduct || !variant || !varientPrice) { return errorRes(res, 400, "Invalid variant or price."); }
      const productIndex = cart.products.findIndex(
        (p) => p.product == productId && p.variant === variant
      );

      if (productIndex > -1) {
        const productVariant = findProduct.priceVarient.find(
          (v) => v.varient === variant
        );
        if (!productVariant || !productVariant.isAvailable) {
          return errorRes(
            res,
            400,
            `Product variant "${variant}" is not available.`
          );
        }
        if (type === "add") {
          // basis on the findProduct productvartant avalibility quantity ko update karna hai 
          if (productVariant.availability >= cart.products[productIndex].quantity + 1) {
            cart.products[productIndex].quantity++;
          } else {
            return errorRes(
              res,
              400,
              `Quantity for "${findProduct.displayName}" cannot be more than ${productVariant.availability}`
            );
          }
        } else if (type === "subtract") {
          if (cart.products[productIndex].quantity >= 2)
            cart.products[productIndex].quantity--;
          else cart.products.splice(productIndex, 1);
        } else if (type === "modify") {
          const { quantity } = req.body;
          if (quantity > 0) {
            if (productVariant.availability >= quantity) {
              cart.products[productIndex].quantity = quantity;
            } else {
              return errorRes(
                res,
                400,
                `Quantity for "${findProduct.displayName}" cannot be more than ${productVariant.availability}`
              );
            }
          }
        }

        else {
          cart.products.splice(productIndex, 1);
        }
      } else {
        if (type === "add") {
          const existingProduct = await Product.findById(productId);
          if (!existingProduct)
            return errorRes(
              res,
              404,
              "Product for which you are trying to update quantity does not exist."
            );
          const productVariant = existingProduct.priceVarient.find(
            (v) => v.varient === variant
          );

          if (!productVariant || !productVariant.isAvailable) {
            return errorRes(
              res,
              400,
              `Product variant "${variant}" is not available.`
            );
          }
          if (productVariant.availability >= 1) {
            cart.products.push({
              product: productId,
              quantity: 1,
              variant: variant,
              varientPrice: varientPrice,
            });
          } else {
            return errorRes(
              res,
              400,
              `Quantity for "${existingProduct.displayName}" cannot be added as the product variant is not available.`
            );
          }
        } else {
          return errorRes(res, 400, "Product does not exist in cart.");
        }
      }
    }
    await cart
      .save()
      .then((updatedCart) => {
        updatedCart
          .populate([
            {
              path: "products.product",
              select:
                "_id displayName brand_title color price product_category displayImage availability",
            },
            { path: "user", select: "displayName email" },
          ])
          .then((result) =>
            successRes(res, {
              cart: result,
              message: "Cart updated successfully.",
            })
          );
      })
      .catch((err) => internalServerError(res, err));
  } catch (err) {
    internalServerError(res, err);
  }
};

module.exports.getwishlistByUser = async (req, res) => {
  try {
    const { _id } = req.user;
    let userWishlist = await User_WishlistDB.findOne({ user: _id });
    if (!userWishlist) {
      userWishlist = new User_WishlistDB({ user: _id, products: [] });
      await userWishlist.save();
    }
    await userWishlist.populate({
      path: "products",
      select:
        "_id displayName brand_title color price product_category displayImage availability",
    });

    successRes(res, { wishlist: userWishlist });
  } catch (error) {
    internalServerError(res, error.message);
  }
};

module.exports.addtoWishlist = async (req, res) => {
  try {
    const { _id } = req.user;
    const { productId, type } = req.params;
    if (!productId) return errorRes(res, 400, "Product id is not found.");
    if (type != "add" && type != "delete") {
      return errorRes(res, 400, "Request type can be - 'add' or 'delete'");
    }
    let wishlist = await User_WishlistDB.findOne({ user: _id });
    if (!wishlist) {
      wishlist = new User_WishlistDB({ user: _id, products: [] });
    }
    const findProductIndex = wishlist.products.indexOf(productId);
    if (type === "delete" && findProductIndex !== -1) {
      wishlist.products.splice(findProductIndex, 1);
    } else if (type === "add" && findProductIndex === -1) {
      wishlist.products.push(productId);
    }
    await wishlist.save();

    successRes(res, { wishlist });
  } catch (error) {
    internalServerError(res, error.message);
  }
};


// module.exports.editProductInCart_post = async (req, res) => {
//   const { _id } = req.user;
//   const { productId, type } = req.params;
//   const { variant, varientPrice } = req.body;

//   if (type != "add" && type != "subtract" && type != "delete") {
//     return errorRes(
//       res,
//       400,
//       "Request type can be - 'add', 'subtract' or 'delete'."
//     );
//   }

//   try {
//     const cart = await User_Cart.findOne({ user: _id });
//     if (!cart) {
//       return errorRes(res, 400, "Internal server error. Please try again.");
//     }
//     if (productId == 'undefined' || productId == ":productId" || productId == null) {
//       removeUndefinedProductsFromCart(cart);
//     } else {
//       await updateProductInCart(cart, productId, variant, varientPrice, type);
//     }

//     await cart.save();

//     const updatedCart = await cart
//       .populate([
//         {
//           path: "products.product",
//           select: "_id displayName brand_title color price product_category displayImage availability",
//         },
//         { path: "user", select: "displayName email" },
//       ])
//     successRes(res, {
//       cart: updatedCart,
//       message: "Cart updated successfully.",
//     });
//   } catch (err) {
//     internalServerError(res, err);
//   }
// };

// // Helper function to remove entries with undefined or non-existing products from the cart
// async function removeUndefinedProductsFromCart(cart) {
//   for (let i = cart.products.length - 1; i >= 0; i--) {
//     const productId = cart.products[i].product;
//     if (!productId) {
//       cart.products.splice(i, 1);
//     } else {
//       const existingProduct = await Product.findById(productId);
//       if (!existingProduct) {
//         cart.products.splice(i, 1);
//       }
//     }
//   }
// }

// // Helper function to update product quantity in the cart
// async function updateProductInCart(cart, productId, variant, varientPrice, type) {
//   const findProduct = await Product.findById(productId);

//   if (!findProduct || !variant || !varientPrice) {
//     return errorRes(res, 400, "Invalid variant or price.");
//   }

//   const productIndex = cart.products.findIndex(
//     (p) => p.product == productId && p.variant === variant
//   );

//   if (productIndex > -1) {
//     if (type === "add") {
//       updateProductQuantity(cart, findProduct, productIndex, variant);
//     } else if (type === "subtract") {
//       updateSubtraction(cart, productIndex);
//     } else {
//       cart.products.splice(productIndex, 1);
//     }
//   } else {
//     if (type === "add") {
//       addProductToCart(cart, productId, findProduct, variant, varientPrice);
//     } else {
//       return errorRes(res, 400, "Product does not exist in cart.");
//     }
//   }
// }

// // Helper function to handle quantity addition
// function updateProductQuantity(cart, findProduct, productIndex, variant) {
//   const productVariant = findProduct.priceVarient.find(
//     (v) => v.varient === variant
//   );

//   if (!productVariant || !productVariant.isAvailable) {
//     return errorRes(res, 400, `Product variant "${variant}" is not available.`);
//   }

//   if (productVariant.availability >= cart.products[productIndex].quantity + 1) {
//     cart.products[productIndex].quantity++;
//   } else {
//     return errorRes(
//       res,
//       400,
//       `Quantity for "${findProduct.displayName}" cannot be more than ${productVariant.availability}`
//     );
//   }
// }

// // Helper function to handle quantity subtraction
// function updateSubtraction(cart, productIndex) {
//   if (cart.products[productIndex].quantity >= 2)
//     cart.products[productIndex].quantity--;
//   else cart.products.splice(productIndex, 1);
// }

// // Helper function to add a new product to the cart
// function addProductToCart(cart, productId, existingProduct, variant, varientPrice) {
//   const productVariant = existingProduct.priceVarient.find(
//     (v) => v.varient === variant
//   );

//   if (!productVariant || !productVariant.isAvailable) {
//     return errorRes(res, 400, `Product variant "${variant}" is not available.`);
//   }

//   if (productVariant.availability >= 1) {
//     cart.products.push({
//       product: productId,
//       quantity: 1,
//       variant: variant,
//       varientPrice: varientPrice,
//     });
//   } else {
//     return errorRes(
//       res,
//       400,
//       `Quantity for "${existingProduct.displayName}" cannot be added as the product variant is not available.`
//     );
//   }
// }
