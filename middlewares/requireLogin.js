const mongoose = require("mongoose");
const Admin = mongoose.model("Admin");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { errorRes } = require("../utility");
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;

module.exports.requireAdminLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return errorRes(res, 401, "Unauthorized access.");
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET_ADMIN, (err, payload) => {
    if (err) return errorRes(res, 401, "Unauthorized access.");
    const { _id } = payload;
    Admin.findById(_id)
      .select("-password -__v")
      .then(admindata => {
        req.admin = admindata;
        next();
      })
      .catch(err => errorRes(res, 500, "Authorization error."));
  });
};

module.exports.requireUserLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return errorRes(res, 401, "Unauthorized access.");
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET_USER, (err, payload) => {
    if (err) return errorRes(res, 401, "Unauthorized access.");
    const { _id } = payload;
    User.findById(_id)
      .select("-password -__v")
      .then(userData => {
        req.user = userData;
        next();
      })
      .catch(err => errorRes(res, 500, "Authorization error."));
  });
};
