const mongoose = require("mongoose");

const schema = mongoose.Schema;

const planSchema = new schema({
    plantype: { type: String, required: true },
    noofsession: { type: String, required: true },
    amount: { type: Number, required: true },
    tax: { type: Number, required: true },
    statusid: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("plans", planSchema);