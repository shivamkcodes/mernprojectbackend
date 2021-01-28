const mongoose = require('mongoose');
// const {
//     model
// } = require('./category');

// todo=> come here and check out...
const {
    ObjectId
} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,

    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 1500,

    },
    price: {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
    },
    category: {
        type: ObjectId,
        ref: "categories",
        required: true
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);