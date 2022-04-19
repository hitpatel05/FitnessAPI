const PaymentDetails = require("../../Model/Payment/PaymentDetails");
const PlanSchema = require("../../Model/Admin/PlanSchema");
const Users = require("../../Model/Client/UserSchema");
const fs = require("fs");
const Secretkey = process.env.APIKEY;
const { SendMailHtml } = require("../EmailController");
const { SendTextMessage } = require("../SMSController");
const { pushNotification } = require("../PushNotificationController");
const { errorLog } = require("../Errorcontroller");
// Specify Stripe secret api key here
const stripe = require("stripe")(Secretkey);
const getintent = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get Secret." });
        if (parseFloat(req.body.amount) <= 0)
            return res.status(200).json({ status: 2, message: `Amount is not valid -> ${req.body.amount}` });
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseFloat(req.body.amount) * 100, // Specify amount here
            currency: req.body.currency // Specify currency here
        });
        // Return client secret
        return res.status(200).json({ status: 1, message: "Secret Fetched", clientSecret: paymentIntent.client_secret });
    }
    catch (err) {
        errorLog("getintent", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const savepayment = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const paymentDetailsInput = {
            userid: req.user._id,
            date: req.body.date,
            noofsession: req.body.noofsession,
            plantype: req.body.plantype,
            amount: req.body.amount
        };
        const paymentReq = new PaymentDetails(paymentDetailsInput);

        await paymentReq.save()
            .then((resdata) => {
                // // update session value - purchase session time.
                const userdata = Users.findOne({ _id: req.user._id });
                // if (userdata) {
                //     if(req.body.plantype == "Standard"){
                //         userdata.standersession = (userdata.standersession || 0)  + (req.body.noofsession || 0);
                //     } else {
                //         userdata.elitesession = (userdata.elitesession || 0)  + (req.body.noofsession || 0);
                //     }
                //     userdata.save();
                // }
                // // Full Payment in Admin Account

                // date: { type: Date, required: true },
                // title: { type: String, required: true },
                // message: { type: String, required: true },
                // type: { type: String, required: true },
                // userid: { type: String, required: true },
                // resid: { type: String, required: true }
                // Mail code.

                // Mail code.
                fs.readFile("./EmailTemplate/PurchasedSession.html", async (error, data) => {
                    if (error)
                        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });

                    const emailbody = data.toString().replace("##Name##", req.user.firstname)
                    .replace("##EntryDate##", paymentDetailsInput.date.toString())
                    .replace("##PlanType##", paymentDetailsInput.plantype.toString())
                    .replace("##NoOfSession##", paymentDetailsInput.noofsession.toString())
                    .replace("##Amount##", paymentDetailsInput.amount.toString());

                    var emaildata = { "to": userdata.email, "subject": "Purchase session", "html": emailbody };

                    let emailresult = await SendMailHtml(emaildata);
                    // if (emailresult === true)
                    //     return res.status(200).json({ status: 1, message: "Purchase Payment successfully email sent." });
                    // else
                    //     return res.status(200).json({ status: 2, message: "Something getting wrong." });
                });

                // Client SMS Code
                let msg = "Your are $ " + req.body.amount.toString() + " spent at purchase " + req.body.plantype.toString() + " plan " + req.body.noofsession.toString() + " sessopns."
                var obj = {
                    number: "+919687367276",
                    body: (msg || ""),
                    data: {
                        date:  new Date(),
                        title: "Purchase session",
                        description: msg,
                        type: req.user,
                        sentby: req.user._id  || "-",
                        sentto: req.user._id  || "-"
                    }
                }
                let smsresult = SendTextMessage(obj);
                //if (smsresult === true)
                //     return res.status(200).json({ status: 1, message: "Purchase Payment successfully sms sent." });
                // else
                //     return res.status(200).json({ status: 2, message: "Something getting wrong." });
               console.log("Success");
               return res.status(200).json({ status: 1, message: "Payment successfully.", result: resdata });
            })
            .catch(function (error) {
                errorLog("savepayment", req.body, error);
                res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
            });
    }
    catch (err) {
        errorLog("savepayment", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getplan = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const planlist = await PlanSchema.find({});
        if (planlist)
            return res.status(200).json({ status: 1, message: "Get Plan successfully.", result: planlist });

        return res.status(200).json({ status: 2, message: "Plan not found.", result: [] });
    }
    catch (err) {
        errorLog("getplan", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
module.exports = { getintent, savepayment, getplan };