const mongoose = require("mongoose");

const schema = mongoose.Schema;
const Plan = new schema({

});
const PackageDetails = new schema({    
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    Status: { type: String, required: false },
    Plan: { type: Plan , required: false }
}, { timestamps: true });

module.exports = mongoose.model("packagedetails", PackageDetails);