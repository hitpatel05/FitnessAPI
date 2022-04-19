const mongoose = require("mongoose");

const schema = mongoose.Schema;

const pushnotificationSchema = new schema({
    date: { type: Date, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    userid: { type: String, required: true },
    resid: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("pushnotifications", pushnotificationSchema);