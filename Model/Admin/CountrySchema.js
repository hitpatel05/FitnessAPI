const mongoose = require("mongoose");

const schema = mongoose.Schema;

const countrySchema = new schema({
    name: { type: String, required: true },
    shortname: { type: String, required: true },
    code: { type: String, required: true },
    mask: { type: String, required: true },
    statusid: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("countrys", countrySchema);