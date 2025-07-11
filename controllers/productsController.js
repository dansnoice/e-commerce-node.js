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

    //add filters
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

    //casehandling for pricing queries
    if (filterQueries.minPrice || filterQueries.maxPrice) {
      queryObject.price = {}; //if min or max, price becomes an object
      if (filterQueries.minPrice) {
        //sets greater than equal condition
        queryObject.price.$gte = Number(filterQueries.minPrice);
      } //sets less than equal condition
      if (filterQueries.maxPrice) {
        queryObject.price.$lte = Number(filterQueries.maxPrice);
      } //if searching for an exactly priced Product
    } else if (filterQueries.price) {
      queryObject.price = Number(filterQueries.price);
      //if none, no worries. Just catches every price condition
    }
    // api/products?sortBy=Name/Price
    if (filterQueries.sortBy) {
      //if queried
      const order = filterQueries.sortOrder === "desc" ? -1 : 1; //sets order for sorting as 1 for asc if our query sortOrder is not "desc"
      sortObject[filterQueries.sortBy] = order; //dynamically takes the sortBy property of the query, puts it inside the sortObject as a key and sets it to be equal to the provided/default order.
    }
    //search for the product(s) using the queries and sorting to our liking
    const products = await Product.find(queryObject).sort(sortObject); //if request is empty, we will get all products.
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
const deleteProduct = async (productId) => {
  try {
    //make sure it's not in any carts
    const carts = await Cart.find({ "items.item": productId });
    for (const cart of carts) {
      let updatedItems = [];
      let newTotal = 0;
      //loops through each cart and removes the product from the items array by failing to carry it through updateItems
      for (const entry of cart.items) {
        //must make stringy comparisons to avoid mongoose objectId issues -_-
        if (entry.item.toString() !== productId.toString()) {
          const product = await Product.findById(entry.item);
          if (product) {
            updatedItems.push({ item: product._id, quantity: entry.quantity });
            newTotal += product.price * entry.quantity;
          }
        }
      }
      await Cart.findByIdAndUpdate(
        cart._id,
        { $set: { items: updatedItems, total: newTotal } },
        { new: true }
      );
    }
    // Finally, delete the product from the product collection
    const deletedProduct = await Product.findByIdAndDelete(productId);
    return deletedProduct;
  } catch (error) {
    throw error;
  }
};

//export
module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
