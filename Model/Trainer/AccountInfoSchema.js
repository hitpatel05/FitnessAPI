const mongoose = require("mongoose");

const schema = mongoose.Schema;

const AccountInfoSchema = new schema({
    userid: { type: String, required: true },
    accountholdername: { type: String, required: true },
    accountnumber: { type: String, required: true },
    bankname: { type: String, required: true },
    swiftcode: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("accountinfo", AccountInfoSchema);