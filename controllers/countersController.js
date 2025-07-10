
const Counter = require("../models/CounterModel");

const getNextOrderNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "orderNumber" },
    { $inc: { value: 1 } },
    { new: true, upsert: true } // creates it if not exists
  );

  return counter.value;
};

module.exports = getNextOrderNumber;
