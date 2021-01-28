const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        maxLength: 32,
        unique: true
    },


}, {
    timestamps: true
});


module.exports = mongoose.model("categories", categorySchema);