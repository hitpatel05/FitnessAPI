const mongoose = require("mongoose");

const schema = mongoose.Schema;

const goalsSchema = new schema({
    name: { type: String, required: true },
    statusid: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("goalstypes", goalsSchema);