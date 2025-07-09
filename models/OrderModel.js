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
            min:1
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
  },
  { timestamps: true }
);

//initialize schema as model
const Order = mongoose.model("Order", orderSchema);
//export model
module.exports = Order;
