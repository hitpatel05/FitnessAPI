const mongoose = require("mongoose");

const schema = mongoose.Schema;

const staffSchema = new schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneno: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    statusid: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("staffusers", staffSchema);