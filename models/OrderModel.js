const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

//create schema
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [
        {
          item: {
            type: ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            min: 1,
          },
        },
      ],
    },
    total: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
    //in no real world would I want the user to know the UUID of their order
    //as such I'm going to make a counter
    orderNumber: {
      type: [Number], //Customer may order many times
      required: true,
    },
  },
  { timestamps: true }
);

//initialize schema as model
const Order = mongoose.model("Order", orderSchema);
//export model
module.exports = Order;
