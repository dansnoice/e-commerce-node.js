const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.objectId;

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
        unique: true
    }
})

const Customer = mongoose.model("Customer", customerSchema)
module.exports = Customer