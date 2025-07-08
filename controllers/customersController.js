//import model
const Customer = require("../models/CustomerModel");

const createCustomer = async (customerData) => {
  try {
    const customer = await Customer.create(customerData);
    return customer;
  } catch (error) {
    throw error;
  }
};
//basic GET, will come back to parameterize for query search
const getCustomers = async () => {
  try {
    customers = await Customer.find();
  } catch (error) {
    throw error;
  }
};

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
