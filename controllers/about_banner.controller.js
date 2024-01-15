const mongoose = require("mongoose");
const About_Banner = require('../models/about_banner.model')
const { errorRes, internalServerError, successRes } = require("../utility");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../middlewares/Cloudinary");

module.exports.addBanner_post = async (req, res) => {
  const { banners, content, title } = req.body;
  const result = [];
  
  if (!req?.files) return errorRes(res, 400, " Banner Image is required.");
  if (!req?.files?.image) return errorRes(res, 400, " Banner Image is required.");
  if (req?.files?.image?.length == 0) return errorRes(res, 400, " Banner Image is required.");
  if (!title || !content) return errorRes(res, 400, "Title and Content is Required..");

  try {
    const imageurl1 = await uploadOnCloudinary(req?.files.image[0]);

    const banner = await new About_Banner({
      bannerImage: { url: imageurl1 },
      title,
      content,
    });

    await banner.save();

    if (banner) {
      return successRes(res, {
        banners: [banner],
        message: "Banners saved successfully.",
      });
    } else {
      return successRes(res, {
        banners: result,
        message: "Banners saved successfully.",
      });
    }
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports.getAllBanners_get = (req, res) => {
  About_Banner.find()
    .then((banners) => successRes(res, { banners }))
    .catch((err) => internalServerError(res, err));
};

module.exports.deleteBanner = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    errorRes(res, 400, "Please fill in the parameter");
    return;
  }

  try {
    const findBanner = await About_Banner.findById({ _id: id });

    if (findBanner) {
      const delImg = await deleteFromCloudinary(findBanner.bannerImage.url);
      const deletedBanner = await About_Banner.findByIdAndDelete({ _id: id });

      if (delImg && deletedBanner) {
        successRes(res, deletedBanner);
      } else {
        internalServerError(res, 500);
      }
    } else {
      errorRes(res, 404, "Banner not found");
    }
  } catch (error) {
    internalServerError(res, error);
  }
};