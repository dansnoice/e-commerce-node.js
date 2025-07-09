//import the model
const Product = require("../models/ProductModel");

const createProduct = async (productData) => {
  try {
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    throw error;
  }
};
const getProducts = async (filterQueries) => {
  try {
    const queryObject = {};
    const sortObject = {};
    
    if (filterQueries.name) {
      queryObject.name = filterQueries.name;
    }
    if (filterQueries.description) {
      queryObject.description = filterQueries.description;
    }
    if (filterQueries.category) {
      queryObject.category = filterQueries.category;
    }
    if (filterQueries.stock) {
      queryObject.stock = filterQueries.stock;
    }
    if (filterQueries.images) {
      queryObject.images = filterQueries.images;
    }
    if (filterQueries.minPrice || filterQueries.maxPrice) {
      queryObject.price = {};
      if (filterQueries.minPrice) {
        queryObject.price.$gte = Number(filterQueries.minPrice);
      }
      if (filterQueries.maxPrice) {
        queryObject.price.$lte = Number(filterQueries.maxPrice);
      }
    } else if (filterQueries.price) {
      queryObject.price = Number(filterQueries.price);
    }

    if (filterQueries.sortBy) {
      const order = filterQueries.sortOrder === "desc" ? -1 : 1;
      sortObject[filterQueries.sortBy] = order;
    }

    const products = await Product.find(queryObject).sort(sortObject);
    return products;
  } catch (error) {
    throw error;
  }
};
const updateProduct = async (productId, productData) => {
  try {
    const product = await Product.findByIdAndUpdate(productId, productData, {
      new: true,
    });
    return product;
  } catch (error) {
    throw error;
  }
};

//export
module.exports = {
  createProduct,
  getProducts,
  updateProduct,
};

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       reqired: true,
//     },
//     //I'd rather make this an array, so that multiple categories can be searched for. Search for all men's clothes, or just sweaters. Need multiple tags, here called category.
//     category: [
//       {
//         type: String,
//         required: true,
//       },
//     ],
//     stock: {
//       type: Number,
//       required: true,
//     },
//     images: [
//       {
//         type: String,
//         ////////////////////////////////////Come back here and give it a broken image path default
//         default: "",
//       },
//     ],
//   },
