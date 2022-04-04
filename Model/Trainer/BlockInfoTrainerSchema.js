const mongoose = require("mongoose");

const schema = mongoose.Schema;

const BlockInfoTrainerSchema = new schema({
    userid: { type: String, required: true },
    trainerid: { type: String, required: true },
    isBlock: { type: Number, required: true },
    reason: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("blockreporttrainers", BlockInfoTrainerSchema);