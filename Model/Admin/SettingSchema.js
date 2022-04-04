const mongoose = require("mongoose");

const schema = mongoose.Schema;

const settingSchema = new schema({
    code: { type: String, required: true },
    key: { type: String, required: true },
    val: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("settings", settingSchema);