//import model
const Customer = require("../models/CustomerModel");
const { initCart } = require("./cartController");

const createCustomer = async (customerData) => {
  try {
    const customer = await Customer.create(customerData);
    //without the intermidate layers, the customer was finishing the creation operation and returning before it could get a cart created and have the cart._id back to the Customer. So we have to do it this way.
    await initCart(customer); //MUST wait for cart to be finished being created
    // const customerWithCart = await Customer.findById(customer._id).populate('cart', 'items -id' ) kept throwing errors for exclusion on field id while I was inside an inclusion projection
    const customerWithCart = await Customer.findById(customer._id).populate({
      path: 'cart',
      select: { items: 1, _id: 0 } //apparently we can do a whole lot with populate, just had to do things a little more selectively
    })
    return customerWithCart; 
  } catch (error) {
    throw error;
  }
};
//basic GET, will come back to parameterize for query search
const getCustomers = async (params) => {
  try {
    let query = {};
    if (params.customerId) {
      query._id = params.customerId;
    }

    const customers = await Customer.find(query).populate('cart', 'items -_id');
    return customers;
  } catch (error) {
    throw error;
  }
};
const updateCustomer = async (customerId, customerInformation) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      customerInformation,
      { new: true }
    );
    return customer;
  } catch (error) {
    throw error;
  }
};

const deleteCustomer = async (customerId) => {
  try {
    const customer = await Customer.findByIdAndDelete(customerId)
    return "successfully deleted"
  } catch (error) {
    throw error
  }
}
const loginGuest = async () => {
  try {
    //check if customer exists
    //if not, create customer
    //no matter what migrate carts migrateCarts()
  } catch (error) {
    throw error;
  }
};

//exports
module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
};

// const customerSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true

//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     address: {
//         type: String,
//     },
//     phone: {
//         type: String,
//         unique: true
