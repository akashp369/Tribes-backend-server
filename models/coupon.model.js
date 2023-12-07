const mongoose = require("mongoose");

const CouponSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  condition: {
    type: String,
    required: true,
  },
  min_price: {
    type: Number,
    required: true,
  },
  discount_percent: {
    type: Number,
    required: true,
    default: 0,
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true,
  },
},{timestamps:true});

mongoose.model("Coupon", CouponSchema);
