const mongoose = require("mongoose");
const Coupon = mongoose.model("Coupon");
const { errorRes, successRes, internalServerError } = require("../utility");

module.exports.addCoupon_post = async (req, res) => {
  const { code, condition, min_price, discount_percent } = req.body;

  if (!code || !condition || !min_price)
    return errorRes(res, 400, "All fields are required.");
  try {
    const couponExist = await Coupon.findOne({ code });
    if (couponExist) return errorRes(res, 400, "Coupon code already exist.");

    const coupon = new Coupon({
      code,
      condition,
      min_price,
      discount_percent,
    });
    coupon.save().then(savedCoupon =>
      successRes(res, {
        coupon: savedCoupon,
        message: "Coupon added successfully",
      })
    );
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports.deleteCoupon_delete = async (req, res) => {
  const { _id } = req.params;
  if (!_id) return errorRes(res, 400, "Coupon Id is required.");

  Coupon.findByIdAndDelete(_id)
    .then(deletedCoupon => {
      if (!deletedCoupon) return errorRes(res, 400, "Coupon does not exist.");
      successRes(res, {
        deletedCoupon,
        message: "Coupon deleted successfully.",
      });
    })
    .catch(err => internalServerError(res, err));
};

module.exports.editCoupons_post = (req, res) => {
  const { _id } = req.params;

  const { code, min_price, condition, is_active, discount_percent } = req.body;
  const updates = {};

  if (code) updates.code = code;
  if (min_price) updates.min_price = min_price;
  if (condition) updates.condition = condition;
  if (is_active?.toString()) updates.is_active = is_active;
  if (discount_percent?.toString()) updates.discount_percent = discount_percent;

  if (Object.keys(updates).length == 0)
    return errorRes(res, 400, "No updates made.");

  Coupon.findByIdAndUpdate(_id, updates, { new: true, runValidators: true })
    .then(updatedCoupon => {
      if (!updatedCoupon) return errorRes(res, 404, "Coupon does not exist.");
      successRes(res, {
        updatedCoupon,
        message: "Coupon updated successfully.",
      });
    })
    .catch(err => internalServerError(res, err));
};

module.exports.getAllCoupons_get = (req, res) => {
  Coupon.find()
    .sort("-is_active")
    .then(coupons => successRes(res, { coupons }))
    .catch(err => internalServerError(res, err));
};

module.exports.getParticularCoupon_get = (req, res) => {
  const { code } = req.params;
  Coupon.findOne({ code: { $regex: new RegExp(code, "i") } })
    .then(coupon => {
      if (!coupon) return errorRes(res, 400, "Invalid coupon code.");
      return successRes(res, { coupon });
    })
    .catch(err => internalServerError(res, err));
};

module.exports.getSinbleById_get = (req, res)=>{
  const {id}= req.params;
  Coupon.findById(id)
  .then(coupon => {
    if (!coupon) return errorRes(res, 400, "Invalid coupon code.");
    return successRes(res, { coupon });
  })
  .catch(err => internalServerError(res, err));
}
