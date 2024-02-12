const express = require("express");
const { requireAdminLogin } = require("../middlewares/requireLogin");
const bannerController = require("../controllers/site_banner.controller");
const upload = require("../middlewares/Multer");
const router = express.Router();

router.post(
  "/admin/banner/add",
  //  requireAdminLogin,
  upload.fields([{ name: "image", maxCount: 2 }, {name:"image2", maxCount:2}]),
  bannerController.addBanner_post 
);
router.get("/banner/all", bannerController.getAllBanners_get);
router.delete("/admin/banner/delete/:id",bannerController.deleteBanner)

module.exports = router;
