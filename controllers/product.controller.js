const mongoose = require("mongoose");
const Product = mongoose.model("Product");
const asynchandler = require('express-async-handler');
const {
  errorRes,
  internalServerError,
  successRes,
  shortIdChar,
} = require("../utility");
const shortid = require("shortid");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../middlewares/Cloudinary");
module.exports.addProduct_post = async (req, res) => {
  console.log(req.body, "<<<thisisbody");
  const {
    displayName,
    brand_title,
    description,
    description1,
    description2,
    color,
    // price,
    priceVarient,
    product_category,
    product_subCategory,
    // product_varient,
    displayImage,
    // availability,


  } = req.body;

  if (
    !displayName ||
    !brand_title ||
    !description ||
    !color ||
    !priceVarient ||
    !product_subCategory ||
    !product_category 
    //  ||!availability
  )
    return errorRes(res, 400, "All fields are required.");
  if (!req.files) return errorRes(res, 400, " Product Image is required.");
  if (!req.files.image)
    return errorRes(res, 400, " Product Image is required.");
  if (req.files.image.length == 0)
    return errorRes(res, 400, " Product Image is required.");
  if (req.files.image.length == 0)
    return errorRes(res, 400, " Product Image is required.");
  const productId = shortid.generate(shortIdChar);
  let imageData = [];
  if (req.files.image.length > 0) {
    const imageurl1 = await uploadOnCloudinary(req.files.image[0]);
    imageData = [...imageData, { url: imageurl1 }];
  }
  if (req.files.image.length > 1) {
    const imageurl1 = await uploadOnCloudinary(req.files.image[1]);
    imageData = [...imageData, { url: imageurl1 }];
  }
  if (req.files.image.length > 2) {
    const imageurl1 = await uploadOnCloudinary(req.files.image[2]);
    imageData = [...imageData, { url: imageurl1 }];
  }
  if (req.files.image.length > 3) {
    const imageurl1 = await uploadOnCloudinary(req.files.image[3]);
    imageData = [...imageData, { url: imageurl1 }];
  }
  if (req.files.image.length > 4) {
    const imageurl1 = await uploadOnCloudinary(req.files.image[4]);
    imageData = [...imageData, { url: imageurl1 }];
  }
  if (req.files.image.length > 5) {
    const imageurl1 = await uploadOnCloudinary(req.files.image[5]);
    imageData = [...imageData, { url: imageurl1 }];
  }
  if (req.files.image.length > 6) {
    const imageurl1 = await uploadOnCloudinary(req.files.image[6]);
    imageData = [...imageData, { url: imageurl1 }];
  }
  // console.log(imageData, "<<thisisimage", req.body.prevImage);
  // return null;
  const parseData = JSON.parse(priceVarient);
  const product = new Product({
    displayName,
    brand_title,
    description,
    description1,
    description2,
    color,
    product_category,
    product_subCategory,
    priceVarient: parseData,
    price: parseData[0].price,
    displayImage: imageData,
    // availability,
    productId,
  });
  await product
    .save()
    .then((savedProd) => {
      if (!savedProd)
        return errorRes(res, 400, "Internal server error. Please try again.");
      else {
        Product.findById(savedProd._id)
          .select("-__v")
          .populate("product_category", "_id name displayImage description")
          .populate("color", "_id color_name hexcode")
          .then((result) =>
            successRes(res, {
              product: result,
              message: "Product added successfully.",
            })
          );
      }
    })
    .catch((err) => internalServerError(res, err));
};

module.exports.editProduct_post = async (req, res) => {
  const { productId } = req.params;
  console.log(req.body)
  const {
    displayName,
    brand_title,
    description,
    description1,
    description2,
    color,
    // price,
    priceVarient,
    product_category,
    product_subCategory,
    // product_varient,
    displayImage,
    // availability,
  } = req.body;

  const updates = {};

  // console.log(req.files, req.body.prevImage);    
  // if (!req.files.image)
  //   return errorRes(res, 400, " Product Image is required.");
  // if (req.files.image.length == 0)
  //   return errorRes(res, 400, " Product Image is required.");
  // if (req.files.image.length == 0)
  //   return errorRes(res, 400, " Product Image is required.");
  let imageData = [];
  let newImage = [];
  if (req?.files?.image?.length > 0) {
    if (req?.files?.image?.length > 0) {
      const imageurl1 = await uploadOnCloudinary(req.files.image[0]);
      imageData = [...imageData, { url: imageurl1 }];
    }
    if (req.files.image.length > 1) {
      const imageurl1 = await uploadOnCloudinary(req.files.image[1]);
      imageData = [...imageData, { url: imageurl1 }];
    }
    if (req.files.image.length > 2) {
      const imageurl1 = await uploadOnCloudinary(req.files.image[2]);
      imageData = [...imageData, { url: imageurl1 }];
    }
    if (req.files.image.length > 3) {
      const imageurl1 = await uploadOnCloudinary(req.files.image[3]);
      imageData = [...imageData, { url: imageurl1 }];
    }
    if (req.files.image.length > 4) {
      const imageurl1 = await uploadOnCloudinary(req.files.image[4]);
      imageData = [...imageData, { url: imageurl1 }];
    }
    if (req.files.image.length > 4) {
      const imageurl1 = await uploadOnCloudinary(req.files.image[4]);
      imageData = [...imageData, { url: imageurl1 }];
    }
    if (req.files.image.length > 5) {
      const imageurl1 = await uploadOnCloudinary(req.files.image[5]);
      imageData = [...imageData, { url: imageurl1 }];
    }
    if (req.files.image.length > 6) {
      const imageurl1 = await uploadOnCloudinary(req.files.image[6]);
      imageData = [...imageData, { url: imageurl1 }];
    }
    // newImage = [...JSON.parse(req.body.prevImage), ...imageData];
  }

  // res.status(200).send(newImage);
  // return null;
  if (displayName) updates.displayName = displayName;
  if (brand_title) updates.brand_title = brand_title;
  if (description) updates.description = description;
  if (description1) updates.description1 = description1;
  if (description2) updates.description2 = description2;
  if (color) updates.color = color;
  // if (price) updates.price = price;
  if (product_category) updates.product_category = product_category;
  if (product_subCategory) updates.product_subCategory = product_subCategory;
  // if (product_varient) updates.product_varient = product_varient.split(',')
  if (priceVarient) {
    const parseData = JSON.parse(priceVarient)
    updates.priceVarient = parseData;
    updates.price = parseData[0].price;

  };
  if (req.files.image.length > 0) {
    if (imageData.length !== 0) updates.displayImage = imageData;
  }
  // if (availability) updates.availability = availability;

  // return null;
  if (Object.keys(updates).length == 0)
    return errorRes(res, 400, "No updates made.");
  else {
    try {
      const findProduct = await Product.findById({ _id: productId });
      findProduct.displayImage.map(async (e) => {
        await deleteFromCloudinary(e.url);
      })
    } catch (error) {
      return internalServerError(res, "Unable to find product");
    }

    Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    })
      .populate("product_category", "_id name displayImage")
      .populate("color", "_id color_name hexcode")
      .then((updatedProd) => {
        if (!updatedProd) return errorRes(res, 400, "Product does not exist.");
        successRes(res, {
          product: updatedProd,
          message: "Product updated successfully.",
          newImage,
        });
      })
      .catch((err) => internalServerError(res, err));
  }
};

module.exports.allProducts_get = (req, res) => {
  Product.find()
    .sort("-createdAt")
    .populate("product_category", "_id name description displayImage")
    .populate("color", "_id color_name hexcode")
    .then((products) => successRes(res, { products }))
    .catch((err) => internalServerError(res, err));
};

module.exports.getParticularProduct_get = (req, res) => {
  const { productId } = req.params;
  console.log(productId);
  Product.findById(productId)
    .populate("product_category", "_id name description displayImage")
    .populate("color", "_id color_name hexcode")
    .then((product) => successRes(res, { product }))
    .catch((err) => internalServerError(res, err));
};

module.exports.deleteProduct_delete = async (req, res) => {
  const { productId } = req.params;
  try {
    const findProduct = await Product.findById({ _id: productId });
    if (findProduct) {
      findProduct.displayImage.map(async (e) => {
        await deleteFromCloudinary(e.url);
      })
    }
    else {
      errorRes(res, 404, 'Product not found');
    }
  } catch (error) {
    internalServerError(res, 'error in finding the product')
  }
  Product.findByIdAndDelete(productId)
    .then((deletedProduct) => {
      if (!deletedProduct) return errorRes(res, 404, "Product not found.");
      return successRes(res, {
        deletedProduct,
        message: "Product deleted successfully.",
      });
    })
    .catch((err) => internalServerError(res, err));
};

module.exports.filterProducts_post = async (req, res) => {
  const { categories, product_subCategory, minPrice, maxPrice, colors, sortBy } = req.body;

  let query = {};
  let query1 = {};

  if (minPrice && maxPrice) {
    query.price = { $gte: minPrice, $lte: maxPrice };
    query1.price = { $gte: minPrice, $lte: maxPrice }
  }
  else if (minPrice) {
    query.price = { $gte: minPrice }
    query1.price = { $gte: minPrice }
  }
  else if (maxPrice) {
    query.price = { $lte: maxPrice }
    query1.price = { $lte: maxPrice }
  };

  if (colors && colors.length != 0) {
    query.color = { $in: colors }
    query1.color = { $in: colors }
  };

  // let subCategoryQuery = {};

  if (product_subCategory && product_subCategory.length != 0) {
    query1.product_subCategory = { $in: product_subCategory };
  }

  if (categories && categories.length != 0) {
    query.product_category = { $in: categories };
  }

  let combinedQuery = categories?.length > 0 && product_subCategory?.length > 0 ?
    [query, query1]
    :
    categories?.length > 0 ?
      [query]
      :
      [query1]


  let sortQuery = {};

  if (sortBy === "price-high-to-low") sortQuery.price = -1;
  else if (sortBy === "price-low-to-high") sortQuery.price = 1;
  else if (sortBy === "latest") sortQuery.createdAt = -1;

  // console.log({ query, subCategoryQuery, sortQuery });
  try {
    const products = await Product.find({
      $or: combinedQuery
    }
    )
      .populate("color product_category")
      .sort(sortQuery);
    return successRes(res, { products });
  } catch (err) {
    return internalServerError(res, err);
  }
};

module.exports.randomProducts_get = async (req, res) => {
  const { limit } = req.params;

  Product.find()
    .populate("product_category color")
    .limit(limit)
    .then((products) => successRes(res, { products }))
    .catch((err) => internalServerError(res, err));
};
module.exports.paginatedSearch = asynchandler(async (req, res) => {
  const { page, limit } = req.query;
  console.log(req.query)
  const getAllProducts = await Product.find();
  if (getAllProducts) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = getAllProducts.slice(startIndex, endIndex);
    const finalResult = {
      result: result,
      totalPage: Math.ceil(getAllProducts.length / limit)
    }
    successRes(res, finalResult);
  }
  else {
    internalServerError(res, 'Unable to fetch the products');
  }


})
// module.exports.searchProduct = async (req, res) => {
//   const { query } = req.query;
//   const queryObject = {};
//   console.log(query)
//   if (query) {

//     queryObject.displayName = { $regex: "T", $options: 'i' }
//     // queryObject.product_subCategory = { $regex: "T", $options: 'i' }

//   }
//   successRes(res, {})
//   // try {
//   //   const findProduct = await Product.find(queryObject);
//   //   if (findProduct) {
//   //     successRes(res, findProduct);
//   //   }
//   //   else {
//   //     errorRes(res, 400, "Cannot find the product");
//   //   }
//   // } catch (error) {
//   //   internalServerError(res, "Error in searching product");
//   // }
// }
// module.exports.searchCategory = async (req, res) => {
//   const { category, subCategory } = req.body;
//   try {
//     const getAllProducts = await Product.find({}).populate('product_category').populate('color');
//     const filterProduct = getAllProducts.filter((e) => {
//       return (e.product_category.name === category || e.product_category.subCategory.includes(subCategory))
//     })
//     successRes(res, filterProduct);
//   } catch (error) {
//     internalServerError(res, 'Unable to fetch category');
//   }

// }


module.exports.availabilityUpdate_put = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { isAvailable } = req.body;
    if (!variantId || !isAvailable) {
      return errorRes(res, 400, "Please provide variantId and isAvailable.")
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { 'priceVarient._id': variantId },
      { $set: { 'priceVarient.$.isAvailable': isAvailable } },
      { new: true }
    );
    if (!updatedProduct) {
      return internalServerError(res, "Internal Server Error.")
    }
    successRes(res, { updatedProduct }, "Product update Successfully.")
  } catch (error) {
    internalServerError(res, 'error in finding the product')
  }
}


module.exports.searchProduct = async (req, res) => {
  const { query } = req.query;
  const queryObject = {};
  console.log(query)
  if (query) {
    queryObject.displayName = { $regex: query, $options: 'i' }
    queryObject.product_subCategory = { $regex: query, $options: 'i' }
  }
  try {
    const findProduct = await Product.find(queryObject);
    if (findProduct) {
      successRes(res, findProduct);
    }
    else {
      errorRes(res, 400, "Cannot find the product");
    }
  } catch (error) {
    internalServerError(res, "Error in searching product");
  }
}

module.exports.prodct_search_get = async (req, res) => {
  try {
    const { query } = req.query;
    const queryObject = {};
    // console.log(query)
    if (query) {
      queryObject.displayName = { $regex: query, $options: 'i' }
      // queryObject.product_subCategory = { $regex: query, $options: 'i' }
    }
    const findProduct = await Product.find(queryObject).limit(5);
    if (findProduct) {
      successRes(res, findProduct);
    }
    else {
      errorRes(res, 400, "Cannot find the product");
    }
  } catch (error) {
    internalServerError(res, "Error in searching product");
  }
}