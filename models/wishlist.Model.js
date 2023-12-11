const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const wishlistSchema = mongoose.Schema(
  {
    products: [
      {
        type: ObjectId,
        required: true,
        ref: "Product",
      },
    ],
    user: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const wishlistModel = mongoose.model("User_Wishlist", wishlistSchema);

module.exports = wishlistModel;
