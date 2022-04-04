const mongoose = require("mongoose");

const schema = mongoose.Schema;

const BlockInfoClientSchema = new schema({
    userid: { type: String, required: true },
    clientid: { type: String, required: true },
    isBlock: { type: Number, required: true },
    reason: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("blockreportclients", BlockInfoClientSchema);