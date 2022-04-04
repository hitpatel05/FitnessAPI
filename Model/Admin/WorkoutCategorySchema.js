const mongoose = require("mongoose");

const schema = mongoose.Schema;

const workoutcategorySchema = new schema({
    name: { type: String },
    status: { type: Boolean, required: true, default: true }
}, { timestamps: true });

module.exports = mongoose.model("workoutcategorys", workoutcategorySchema);