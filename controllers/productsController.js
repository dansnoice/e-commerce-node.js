//import the model
const Product = require("../models/ProductModel")


const createProduct = async (productData) => {
  try {
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    throw error;
  }
};
const getProducts = async () => {
  try {
    const products = await Product.find()
    return products
  } catch (error) {
    throw error
  }
}








//export
module.exports = {
  createProduct,
  getProducts
}
























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
