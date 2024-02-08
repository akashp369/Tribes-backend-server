const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth.controller");

router.post("/admin/signup", auth_controller.adminSignup_post);
router.post("/admin/signin", auth_controller.adminSignin_post);
router.post("/admin/updatepassword", auth_controller.updatePassword);
router.post("/user/signup", auth_controller.userSignup_post);
router.post("/user/signin", auth_controller.userSignin_post);
router.post('/user/forgot/sendotp', auth_controller.forgot)
router.post('/user/forgot/submitotp', auth_controller.verifyOTP)


module.exports = router;
