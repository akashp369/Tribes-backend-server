const mongoose = require("mongoose");
const Admin = mongoose.model("Admin");
const User = mongoose.model("User");
const User_Cart = mongoose.model("User_Cart");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const {
  errorRes,
  internalServerError,
  successRes,
} = require("../utility/index");
require("dotenv").config();
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASS,
  }
});

module.exports.adminSignup_post = async (req, res) => {
  const { displayName, email, password } = req.body;

  if (!displayName || !email || !password)
    return errorRes(res, 400, "All fields are required.");

  try {
    const savedUser = await User.findOne({ email });
    if (savedUser)
      return errorRes(res, 400, "Use different email for admin account.");
  } catch (err) {
    console.log(err);
  }

  Admin.findOne({ email })
    .then((savedAdmin) => {
      if (savedAdmin) return errorRes(res, 400, "Admin already exist.");
      else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err)
            return errorRes(
              res,
              400,
              "Internal server error. Please try again."
            );

          bcrypt
            .hash(password, salt)
            .then((hashedPass) => {
              const admin = new Admin({
                displayName,
                email,
                password: hashedPass,
              });
              admin
                .save()
                .then((admin) => {
                  const { _id, displayName, email } = admin;
                  const token = jwt.sign({ _id }, JWT_SECRET_ADMIN);

                  return successRes(res, {
                    admin: { _id, displayName, email, token },
                    message: "Admin added successfully.",
                  });
                })
                .catch((err) => internalServerError(res, err));
            })
            .catch((err) => internalServerError(res, err));
        });
      }
    })
    .catch((err) => internalServerError(res, err));
};

module.exports.adminSignin_post = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return errorRes(res, 400, "All fields are required.");
  Admin.findOne({ email })
    .then((savedAdmin) => {
      if (!savedAdmin) return errorRes(res, 400, "Invalid login credentials.");
      bcrypt
        .compare(password, savedAdmin.password)
        .then((doMatch) => {
          if (!doMatch) return errorRes(res, 400, "Invalid login credentials.");

          const { _id, displayName, email } = savedAdmin;
          const token = jwt.sign({ _id }, JWT_SECRET_ADMIN);
          return successRes(res, {
            admin: { _id, displayName, email, token },
            message: "Signin success.",
          });
        })
        .catch((err) => internalServerError(res, err));
    })
    .catch((err) => internalServerError(res, err));
};

module.exports.userSignup_post = async (req, res) => {
  const { displayName, email, password, phoneNumber } = req.body;

  if (!displayName || !email || !password || !phoneNumber)
    return errorRes(res, 400, "All fields are required.");

  try {
    const savedAdmin = await User.findOne({ email });
    if (savedAdmin)
      return errorRes(res, 400, "Use different email for user account.");
  } catch (err) {
    console.log(err);
  }

  User.findOne({ phoneNumber }).then((savedNumber) => {
    if (savedNumber)
      return errorRes(
        res,
        400,
        "Given phone number is associated with different account."
      );
  });

  User.findOne({ email }).then((savedUser) => {
    if (savedUser)
      return errorRes(res, 400, "User already registered with given email.");

    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        return errorRes(res, 400, "Internal server error. Please try again.");

      bcrypt
        .hash(password, salt)
        .then((hashedPass) => {
          const user = new User({
            displayName,
            email,
            phoneNumber,
            password: hashedPass,
          });
          user
            .save()
            .then(async (user) => {
              const newCart = new User_Cart({
                user: user._id,
                products: [],
              });
              const cart = await newCart.save();

              user.cart = cart._id;
              await user.save();
              const {
                _id,
                displayName,
                displayImage,
                email,
                phoneNumber,
                accountType,
                shippingAddress,
              } = user;
              const token = jwt.sign({ _id }, JWT_SECRET_USER);

              return successRes(res, {
                user: {
                  _id,
                  displayName,
                  displayImage,
                  email,
                  phoneNumber,
                  cart: cart._id,
                  accountType,
                  shippingAddress,
                  token,
                },
                message: "User added successfully.",
              });
            })
            .catch((err) => internalServerError(res, err));
        })
        .catch((err) => internalServerError(res, err));
    });
  });
};

module.exports.userSignin_post = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return errorRes(res, 400, "All fields are required.");
  User.findOne({
    email,
  })
    .then((savedUser) => {
      if (!savedUser) return errorRes(res, 400, "Invalid login credentials.");
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (!doMatch) return errorRes(res, 400, "Invalid login credentials.");
          else if (savedUser.isBlocked)
            return errorRes(res, 400, "User blocked by admin.");

          const {
            _id,
            displayName,
            contactNumber,
            displayImage,
            cart,
            shippingAddress,
            email,
            phoneNumber,
            accountType,
            coupon_applied,
            isBlocked,
          } = savedUser;
          const token = jwt.sign({ _id }, JWT_SECRET_USER);
          return successRes(res, {
            user: {
              _id,
              displayName,
              displayImage,
              email,
              contactNumber,
              accountType,
              phoneNumber,
              isBlocked,
              cart,
              coupon_applied,
              shippingAddress,
              token,
            },
            message: "Signin success.",
          });
        })
        .catch((err) => internalServerError(res, err));
    })
    .catch((err) => internalServerError(res, err));
};



module.exports.forgot = async (req, res) => {
  let { email } = req.body;
  if (!email)
    return errorRes(res, 400, "All fields are required.");
  try {
    const normalizedEmail = email.toLowerCase();
    const emailRegExp = new RegExp(`^${normalizedEmail}$`, 'i');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findOne({email:emailRegExp});
    if(!user){
      return errorRes(res, 404, "User not Found.");
    }
    user.passwordResetOTP = otp;
    user.passwordResetOTPExpires = Date.now() + 600000;
    await user.save();
    var mailOptions = {
      from: process.env.APP_EMAIL,
      to: user?.email,
      subject: 'Otp for Reset Password',
      text: `Your OTP for password reset is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
    return successRes(res, {
      message: 'OTP sent to your email address.',
    });
  } catch (error) {
    return internalServerError(res, error);
  }
};

module.exports.verifyOTP = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return errorRes(res, 400, 'All fields are required.');
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const emailRegExp = new RegExp(`^${normalizedEmail}$`, 'i');
    const user = await User.findOne({ email:emailRegExp });
    if (!user) {
      return errorRes(res, 404, 'User not found.');
    }
    if (user.passwordResetOTPExpires && Date.now() > user.passwordResetOTPExpires) {
      return errorRes(res, 400, 'OTP has expired. Please request a new OTP.');
    }
    if (otp != user.passwordResetOTP) {
      return errorRes(res, 400, 'Invalid OTP. Please enter the correct OTP.');
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    user.password = hashedPassword;
    user.passwordResetOTP = null;
    user.passwordResetOTPExpires = null;

    await user.save();

    return successRes(res, {
      message: 'Password Update successful.',
    });
  } catch (err) {
    return internalServerError(res, err);
  }
};

