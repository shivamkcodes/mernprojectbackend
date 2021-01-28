const mongoose = require('mongoose');
const crypto = require("crypto");
// todo
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastName: {
        type: String,
        maxlength: 20,
        trim: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    salt: String,
    //TODO
    encry_password: {
        type: String,
        required: true

    },

    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },


}, {
    timestamps: true
});



userSchema
    .virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    autheticate: function (plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password;
    },

    securePassword: function (plainpassword) {
        if (!plainpassword) return "";
        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainpassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};


module.exports = mongoose.model("User", userSchema);