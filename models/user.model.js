const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const UserSchema = mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/piyush27/image/upload/v1632215188/story/Group_113_rufkkn.png",
      },
    },
    cart: {
      type: ObjectId,
      ref: "User_Cart",
    },
    shippingAddress: [
      {
        address: {
          type: String,
        },
        pincode: {
          type: Number,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    accountType: {
      type: String,
      default: "user",
    },
    coupon_applied: [],
  },
  { timestamps: true }
);

mongoose.model("User", UserSchema);
