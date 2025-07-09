//import model
const Customer = require("../models/CustomerModel");
const { initCart } = require("./cartController");

const createCustomer = async (customerData) => {
  try {
    const customer = await Customer.create(customerData);
    initCart(customer)
    return customer;
  } catch (error) {
    throw error;
  }
};
//basic GET, will come back to parameterize for query search
const getCustomers = async () => {
  try {
    customers = await Customer.find();
    return customers
  } catch (error) {
    throw error;
  }
};
const loginGuest = async() => {
  try {
    //check if customer exists
    //if not, create customer

    //no matter what migrate carts migrateCarts()

  } catch (error) {
    throw error
  }
}

//exports
module.exports = {
  createCustomer,
  getCustomers,
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
