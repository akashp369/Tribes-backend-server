const mongoose = require("mongoose");
const Product_Color = mongoose.model("Product_Color");
const {
  errorRes,
  internalServerError,
  successRes,
  hexcodeValidate,
  firstLetterCapitalInString,
} = require("../utility");

module.exports.addColor_post = async (req, res) => {
  const { color_name, hexcode } = req.body;

  if (!color_name || !hexcode)
    return errorRes(res, 400, "All fields are required.");
  if (!hexcodeValidate(hexcode)) return errorRes(res, 400, "Invalid hexcode");

  const hexCodeExist = await Product_Color.findOne({ hexcode });
  if (hexCodeExist)
    return errorRes(
      res,
      400,
      `Given hexcode already exist with name: ${hexCodeExist.color_name}`
    );

  const resultColor = firstLetterCapitalInString(color_name);
  Product_Color.findOne({ color_name: resultColor })
    .then(async savedcolor => {
      if (savedcolor) return errorRes(res, 400, "Color name already exist.");

      const productColor = new Product_Color({
        color_name: resultColor,
        hexcode,
      });

      await productColor
        .save()
        .then(savedProductColor =>
          successRes(res, {
            product_color: savedProductColor,
            message: "Color added successfully.",
          })
        )
        .catch(err => internalServerError(res, err));
    })
    .catch(err => internalServerError(res, err));
};

module.exports.allColor_get = (req, res) => {
  Product_Color.find()
    .sort("color_name")
    .then(colors => successRes(res, { colors }))
    .catch(err => internalServerError(res, err));
};
