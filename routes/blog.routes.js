const express = require("express");
const blogController = require("../controllers/blog.controller");
const { requireAdminLogin } = require("../middlewares/requireLogin");
const upload = require("../middlewares/Multer");
const router = express.Router();

router.post(
  "/admin/blog/add",
  // requireAdminLogin,

  upload.fields([{ name: "image", maxCount: 5 }]),
  blogController.addBlog_post
);
router.get("/blog/all", blogController.getAllBlogs_get);
router.delete(
  "/admin/blog/:_id/delete",
  // requireAdminLogin,
  blogController.deleteBlog_delete
);
router.post(
  "/admin/blog/:_id/edit",
  upload.fields([{ name: "image", maxCount: 5 }]),
  blogController.editBlog_post
);
router.get("/blog/getblog/:id",blogController.getBlog_get);

module.exports = router;
