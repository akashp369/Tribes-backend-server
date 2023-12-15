const mongoose = require("mongoose");
const User = mongoose.model("User");
const User_Cart = mongoose.model("User_Cart");
const {
  errorRes,
  internalServerError,
  successRes,
  addressValidator,
} = require("../utility/index");
const asynchandler = require("express-async-handler");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../middlewares/Cloudinary");
module.exports.allusers_get = (req, res) => {
  User.find()
    .sort("displayName")
    .select("-password -__v")
    .then(users => successRes(res, { users }))
    .catch(err => internalServerError(res, err));
};

module.exports.blockUser_post = (req, res) => {
  const { userId, blockStatus } = req.params;
  if (!userId || !blockStatus) return errorRes(res, 400, "Invalid request.");

  User.findByIdAndUpdate(
    userId,
    { isBlocked: blockStatus },
    { new: true, runValidators: true }
  )
    .select("-password")
    .then(updatedUser => {
      if (!updatedUser) return errorRes(res, 400, "User does not exist");

      if (updatedUser.isBlocked)
        return successRes(res, {
          updatedUser,
          message: "User blocked successfully.",
        });
      else
        return successRes(res, {
          updatedUser,
          message: "User unblocked successfully.",
        });
    })
    .catch(err => internalServerError(res, err));
};

module.exports.updateUserAddress_post = (req, res) => {
  const { shippingAddress } = req.body;
  const { _id } = req.user;
  if (shippingAddress) {
    User.findByIdAndUpdate(
      _id,
      { shippingAddress },
      { new: true, runValidators: true }
    )
      .select("-password -__v -accountType -isBlocked")
      .then(updatedUser => {
        if (updatedUser) {
          return res.json({
            status: "success",
            data: {
              user: updatedUser,
            },
            message: "Address updated.",
          });
        } else return errorRes(res, 400, "User does not exist.");
      })
      .catch(err => internalServerError(res, err));
  } else {
    return errorRes(res, 400, "Address cannot be empty.");
  }
};

module.exports.deleteUser_delete = (req, res) => {
  const { userId } = req.params;

  User.findByIdAndDelete(userId)
    .then(deletedUser => {
      if (!deletedUser) return errorRes(res, 404, "User does not exist");
      else {
        User_Cart.findByIdAndDelete(deletedUser.cart).then(deletedCart => {
          if (!deletedCart)
            return successRes(res, {
              deletedUser,
              message: "User deleted successfully.",
            });
          else {
            return successRes(res, {
              deletedUser,
              deletedCart,
              message: "User and related data deleted successfully.",
            });
          }
        });
      }
    })
    .catch(err => internalServerError(res, err));
};

module.exports.getUser = asynchandler(async (req, res) => {
  const id = req.user._id;
  const findUser = await User.findById({ _id: id }).select("-password -__v").populate("cart");
  if (findUser) {
    successRes(res, findUser);
  }
  else {
    errorRes(res, 404, "Cannot find the user");
  }
})


module.exports.updateUser = asynchandler(async (req, res) => {
  const id = req.user._id;
  const findUser = await User.findById({ _id: id }).select("-password -__v").populate("cart");
  if (findUser) {
    const { displayName, phoneNumber } = req.body;
    const updateData = {};
    if (displayName) {
      updateData.displayName = displayName;
    }
    if (phoneNumber) {
      updateData.phoneNumber = phoneNumber;
    }
    if (req.file) {
      const deleteFromCloud = await deleteFromCloudinary(findUser.displayImage.url);
      const uploadedUrl = await uploadOnCloudinary(req.file.path);
      updateData.displayImage = { url: uploadedUrl };
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: id }, updateData, { new: true });
    if (updatedUser) {
      successRes(res, updatedUser)
    }
    else {
      internalServerError(res, 'Failed to update the user');
    }
  }
  else {
    errorRes(res, 404, "Cannot find the user");
  }
})


module.exports.deleteAddress_patch =asynchandler(async(req, res)=>{
  try {
    const id = req.user._id;
    const {addressId} = req.params;
    const user = await User.findById(id)
    if(!user) return errorRes(res, 404, "User is not Found.")
    const addressIndex = user?.shippingAddress?.findIndex(
      address => address._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return errorRes(res, 400, "Address not found.");
    }
    user.shippingAddress.splice(addressIndex, 1);
    const update = await user.save();
    if(!update){
      internalServerError(res, "Failed due to internal server error.")
    }
    successRes(res, update)
  } catch (error) {
    internalServerError(res, error.message)
  }
})