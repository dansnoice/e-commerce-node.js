const mongoose= require("mongoose");

const Product = new mongoose.Schema(
    {
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {    
        type: String,
        required: true
    },
    price: {
        type: Number,
        reqired: true
    },
    //I'd rather make this an array, so that multiple categories can be searched for. Search for all men's clothes, or just sweaters. Need multiple tags, here called category.
    category: [{
        type: String,
        required: true
    }],
    stock: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        ////////////////////////////////////Come back here and give it a broken image path default
        default: ""
    }]










    }
)