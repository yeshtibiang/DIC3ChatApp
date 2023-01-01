const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 30,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 60
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    public_key: {
        type: String,
        required: [true, ""]
    },
    private_key: {
        type: String,
        required: [true, ""]
    }
})

module.exports = mongoose.model("Users", userSchema);