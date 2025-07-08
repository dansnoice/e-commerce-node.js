const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectToMongoDB = async function () {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("GO GO MONGODB")  
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectToMongoDB;
