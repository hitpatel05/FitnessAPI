const mongoose = require("mongoose");

const schema = mongoose.Schema;

// const PaymentDetails = new schema({
//     userid: { type: Number, required: true },
//     sessionid: { type: String, required: true },
//     payid: { type: String, required: true },
//     date: { type: Date, required: true },
//     Description: { type: String, required: true },
//     Name: { type: String, required: true },
//     CCNo: { type: String, required: true },
//     Status: { type: String, required: false },
//     Amount: { type: Float, required: true },
//     CCType: { type: String, required: false }
// }, { timestamps: true });

// module.exports = mongoose.model("paymentdetails", PaymentDetails);

const PaymentInfoDetails = new schema({
    userid: { type: String, required: true },
    date: { type: Date, required: true },
    noofsession: { type: Number, required: true },
    plantype: { type: String, required: true },
    amount: { type: Number, required: true },
    payid: { type: String, required: false },
    description: { type: String, required: false },
    name: { type: String, required: false },
    CCNo: { type: String, required: false },
    CCType: { type: String, required: false },
    status: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("paymentdetails", PaymentInfoDetails);