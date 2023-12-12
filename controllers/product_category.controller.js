const mongoose = require("mongoose");
const ProductCategory = mongoose.model("Product_Category");
const { errorRes, internalServerError, successRes } = require("../utility");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../middlewares/Cloudinary");
module.exports.addProductCategory_post = async (req, res) => {
  const imageurl1 = await uploadOnCloudinary(req.files.image[0]);
  const { name, description, subCategory } = req.body;
  if (!name || !description || !req.files)
    return errorRes(res, 400, "All fields are required.");
  else {
    ProductCategory.findOne({ name: { $regex: new RegExp(name, "i") } }).then(
      savedCateg => {
        if (savedCateg)
          return errorRes(res, 400, "Category with given name already exist.");
        else {

          const category = new ProductCategory({
            name,
            description,
            displayImage: { url: imageurl1 },
            subCategory: subCategory.split(',')
          });
          category
            .save()
            .then(savedCateg => {
              const { name, description, displayImage, _id ,subCategory} = savedCateg;
              return successRes(res, {
                product_category: { _id, name, description, displayImage,subCategory },
                message: "Category added successfully.",
              });
            })
            .catch(err => internalServerError(res, err));
        }
      }
    );
  }
};

module.exports.allCategory_get = (req, res) => {
  ProductCategory.find()
    .sort("name")
    .select("-__v")
    .then(categories => {
      return successRes(res, { categories });
    })
    .catch(err => internalServerError(res, err));
};

module.exports.deleteProductCategory_delete = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) return errorRes(res, 400, "Category ID is required.");
  const product_C = await ProductCategory.findById({ _id: categoryId });
  if (!product_C) return errorRes(res, 400, "Category does not exist.");

  await deleteFromCloudinary(product_C.displayImage.url)
  ProductCategory.findByIdAndDelete(categoryId)
    .then(deletedCategory => {
      if (!deletedCategory)
        return errorRes(res, 400, "Category does not exist.");
      else
        return successRes(res, {
          deletedCategory,
          message: "Category deleted successfully.",
        });
    })
    .catch(err => console.log(err));
};
module.exports.editCategory = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) return errorRes(res, 400, "Category ID is required.");
  const product_C = await ProductCategory.findById({ _id: categoryId });
  if (!product_C) return errorRes(res, 400, "Category does not exist.");
  try {
    const changes = {}
    const { name, description, subCategory } = req.body;
    if (name) {
      changes.name = name;
    }
    if (description) {
      changes.description = description
    }
    if (subCategory) {

      changes.subCategory = subCategory.split(',');
    }
    if (req.files) {
      deleteFromCloudinary(product_C.displayImage.url)
      const imageurl1 = await uploadOnCloudinary(req.files.image[0]);
      changes.displayImage = { url: imageurl1 };
    }
    const updatedData = await ProductCategory.findByIdAndUpdate({ _id: categoryId }, updatedData, { new: true });
    successRes(res, updatedData);
  } catch (error) {
    internalServerError(res, "Error in editing product category");
  }
}

module.exports.getSingleCategory_get = async(req, res)=>{
  try {
    const {id} = req.params;
    const find = await ProductCategory.findById(id)
    if(!find){
      return errorRes(res, 404, "Category is Not Found.")
    }
    successRes(res, find)
  } catch (error) {
    internalServerError(res, error.message)
  }
}