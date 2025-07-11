const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews:{
      type: String,
      required: true,
      default: "Be the first to review this project!" //future goal: only allow a Customer who has purchased the product to leave a review, referencing order history
      //make review a model of its own, associate ObjectId's here. On review creation, do a filtered search for orders containing a positive quantity of the item by the given customer
    }, 
    price: {
      type: Number,
      reqired: true,
    },
    //I'd rather make this an array, so that multiple categories can be searched for. Search for all men's clothes, or just sweaters. Need multiple tags, here called category.
    category: [
      {
        type: String,
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        ////////////////////////////////////Come back here and give it a default to an "image not located" image url
        default: "",
      },
    ],
  },
  { timestamps: true }
);

//make the model
const Product = mongoose.model("Product", productSchema);
//export
module.exports = Product;
