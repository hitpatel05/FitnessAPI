const mongoose = require("mongoose");

const schema = mongoose.Schema;

const Transaction = new schema({
    userid: { type: Int, required: true },
    sessionid: { type: String, required: true },
    payid: { type: String, required: true },
    date: { type: Date, required: true },
    Description: { type: String, required: true },
    Name: { type: String, required: true },
    CCNo: { type: String, required: true },
    Status: { type: String, required: false },
    Amount: { type: Float, required: true },
    CCType: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("transaction", Transaction);