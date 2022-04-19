const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
    profile: { type: String },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneno: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    heightisfeet: { type: Boolean, required: true },
    height: { type: Number, required: true },
    weightiskg: { type: Boolean, required: true },
    weight: { type: Number, required: true },
    equipmentavailable: { type: String },
    fitnessgoals: { type: String },
    otherfitnessgoals: { type: String },
    injuriesorhelthissues: { type: String },
    emailnotifications: { type: Boolean },
    maillinglist: { type: Boolean },
    textnotifications: { type: Boolean },
    webnotifications: { type: Boolean },
    mobilenotifications: { type: Boolean },
    statusid: { type: Number, required: true, default: 1 },
    bookmarktrainer: { type: [] },
    progressphotos: { type: [] },
    standersession: { type: Number },
    elitesession: { type: Number },
    videostatus: { type: Number, required: false, default: 0 },
    meetingid: { type: String, default: "" },
    notification: { type: {} },
    deviceid: { type: String },
    devicetype: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("clientusers", userSchema);