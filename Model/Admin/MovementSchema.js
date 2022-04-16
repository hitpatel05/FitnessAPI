const mongoose = require("mongoose");

const schema = mongoose.Schema;

const movementSchema = new schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    statusid: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("movements", movementSchema);