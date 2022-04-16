const mongoose = require("mongoose");

const schema = mongoose.Schema;

const SessionRequestSchema = new schema({
    userid: { type: String, required: true },
    trainerid: { type: String, required: true },
    date: { type: Date, required: true },
    starthour: { type: String, required: true },
    endhour: { type: String, required: true },
    requeststatus: { type: Number, required: true },
    requestType: { type: Number, required: false, default: 0  },
    reason: { type: String },
    availablestatus: { type: Number },
    sessionworkout: { type: {} },
    sessionrating: { type: {} },
    startdatetime: { type: Date },
    enddatetime: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model("sessionrequest", SessionRequestSchema);