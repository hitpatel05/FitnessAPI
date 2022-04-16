const mongoose = require("mongoose");

const schema = mongoose.Schema;

const notificationSchema = new schema({
    date: { type: Date, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    sentby: { type: String, required: true },
    sentto: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("notifications", notificationSchema);