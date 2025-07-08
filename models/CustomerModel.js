const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
    },
    cart: [
      {
        type: objectId,
        ref: "Cart",
      },
    ],
    orders: [
      {
        type: objectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
