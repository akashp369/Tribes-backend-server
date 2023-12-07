const mongoose = require("mongoose");

const productColorSchema = new mongoose.Schema(
  {
    color_name: {
      type: String,
      required: true,
    },
    hexcode: {
      type: String,
      required: true,
    },
  },
  {timestamps:true},
  { versionKey: false }
);

mongoose.model("Product_Color", productColorSchema);
