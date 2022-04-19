const mongoose = require("mongoose");

const schema = mongoose.Schema;

//{ name: { type: String }, path: [ { uri: { type: String }, name: { type: String }, type: { type: String }}]}
const userSchema = new schema({
  coverprofile: { type: String },
  profile: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneno: { type: String },
  gender: { type: String },
  aboutus: { type: String },
  trainingstyle: { type: String },
  quote: { type: String },
  experience: { type: Number },
  //qualifications: { name: { type: String }, path: [ { uri: { type: String }, name: { type: String }, type: { type: String }}]},
  qualifications: { type: {} },
  specialitys: { type: String },
  introduction: { type: String },
  //certifications:  { name: { type: String }, path: [ { uri: { type: String }, name: { type: String }, type: { type: String }}]},
  certifications: { type: {} },
  emailnotifications: { type: Boolean },
  maillinglist: { type: Boolean },
  textnotifications: { type: Boolean },
  statusid: { type: Number, required: true, default: 2 },
  availablestatus: { type: Number, required: false, default: 0 },
  type: { type: String },
  videostatus: { type: Number, required: false, default: 0 },
  meetingid: { type: String, default: "" },
  deviceid: { type: String },
  devicetype: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("trainerusers", userSchema);