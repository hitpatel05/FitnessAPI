const mongoose = require("mongoose");

const schema = mongoose.Schema;

const VideoSessionsDetails = new schema({    
    meetingid: { type: String, required: true },
    sessionid: { type: String, required: true },
    fromid: { type: String, required: true },
    toid: { type: String, required: true },
    starttime : { type: Date, required: true },
    endtime : { type: Date },
    statusid: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("videosessions", VideoSessionsDetails);