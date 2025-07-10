//The only reason this exists is to create a counter
// (starting at 1000 so our business doesn't look brand new)

const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
