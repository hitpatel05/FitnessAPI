const ScheduleRequestSchema = require("../../Model/Client/SessionRequestSchema");
const Users = require("../../Model/Client/UserSchema");
const Trainers = require("../../Model/Trainer/UserSchema");
const { SendTextMessage } = require("../SMSController");
const { errorLog } = require("../Errorcontroller");
const mongoose = require('mongoose');
const ScheduleRequestUpdate = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const scheduleRequestInput = await ScheduleRequestSchema.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });
        if (scheduleRequestInput) {
            scheduleRequestInput.requeststatus = req.body.status;
            scheduleRequestInput.reason = (req.body.status == 1) ? "" : req.body.reason;
            scheduleRequestInput.save();

            // if (req.body.status == 1) {
            //     const trainerdata = Trainers.findOne({ _id: mongoose.Types.ObjectId(scheduleRequestInput.trainerid) });
            //     if (trainerdata) {
            //         // update session value - accept session time.
            //         const userdata = Users.findOne({ _id: mongoose.Types.ObjectId(scheduleRequestInput.userid) });
            //         if (userdata) {
            //             if((trainerdata.type || "").toLowerCase() == "standard") {
            //                 userdata.standersession = (userdata.standersession) - (req.body.noofsession || 0);
            //             } else {
            //                 userdata.elitesession = (userdata.elitesession) - (req.body.noofsession || 0);
            //             }
            //             userdata.save();
            //         }
            //         // No. of Perc to transfer In trainer account depends trainer type.
            //     }
            // }
            const userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(scheduleRequestInput.userid) });
            const trainerdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(scheduleRequestInput.trainerid) });
            // Client SMS Code
            if (req.body.status != 1) {
                let msg = userdata.firstname + " your session request is reject by " + trainerdata.firstname + "."
                var jsonData = {
                    date:  new Date(),
                    title: "Reject session request",
                    description: msg,
                    sentby: req.user._id || "-",
                    sentto: userdata._id || "-",
                };
                var obj = {
                    number: userdata.phoneno,
                    body: (msg || ""),
                    data: jsonData
                }
                let smsresult = SendTextMessage(obj);
            }

            return res.status(200).json({ status: 1, message: (req.body.status == 1) ? "Request accepted successfully." : "Request rejected successfully." });
        }
        return res.status(200).json({ status: 2, message: "Request not found." });
    }
    catch (err) {
        errorLog("ScheduleRequestUpdate", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const SessionActiveStatusUpdate = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const scheduleRequestInput = await ScheduleRequestSchema.findOne({ _id: req.body.id });
        console.log(scheduleRequestInput)
        if (scheduleRequestInput) {
            // Available Status Online Session Default - 0, Start - 1, End - 0
            scheduleRequestInput.availablestatus = req.body.availablestatus;
            scheduleRequestInput.save();

            const userexists = await Users.findById({ _id: scheduleRequestInput.trainerid });
            if (userexists) {
                // Available Status Online Trainer - 2 - Red
                userexists.availablestatus = (req.body.availablestatus == 1) ? 2 : 1;
                userexists.save();
            }

            return res.status(200).json({ status: 1, message: (req.body.status == 1) ? "Request accepted successfully." : "Request rejected successfully." });
        }
        return res.status(200).json({ status: 2, message: "Request not found." });
    }
    catch (err) {
        errorLog("SessionActiveStatusUpdate", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const getSessionRequest = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        //const sessionRequestlist = await ScheduleRequestSchema.find({ requeststatus: 0, trainerid: req.user._id });
        const sessionRequestlist = await ScheduleRequestSchema.aggregate([
            //{ $match: { requeststatus: 0, trainerid: req.user._id } },
            { $match: { requeststatus: 0, trainerid: req.user._id, date: { $gte: d } } },
            { $sort: { date: -1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            // {
            //     $lookup: {
            //         from: "trainerusers",
            //         localField: "tId",
            //         foreignField: "_id",
            //         as: "trainer_data"
            //     }
            // },
            // { $unwind: "$trainer_data" },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" },
        ]);
        //const sessionAcceptlist = await ScheduleRequestSchema.find({ requeststatus: 1, trainerid: req.user._id });
        const sessionAcceptlist = await ScheduleRequestSchema.aggregate([
            { $match: { requeststatus: 1, trainerid: req.user._id , date: { $gte: d }} },
            { $sort: { date: -1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            // {
            //     $lookup: {
            //         from: "trainerusers",
            //         localField: "tId",
            //         foreignField: "_id",
            //         as: "trainer_data"
            //     }
            // },
            // { $unwind: "$trainer_data" },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" },
        ]);
        const objRes = {
            requestList: sessionRequestlist || [],
            acceptList: sessionAcceptlist || []
        }
        return res.status(200).json({ status: 1, message: "Get successfully.", result: objRes });
    }
    catch (err) {
        errorLog("getSessionRequest", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const workout = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const scheduleRequestInput = await ScheduleRequestSchema.findOne({ _id: req.body.id });
        if (scheduleRequestInput) {
            scheduleRequestInput.sessionworkout = req.body;
            scheduleRequestInput.save();

            const userdata = Users.findOne({ _id: scheduleRequestInput.userid });
            // Client SMS Code
            let msg = userdata.firstname + " session workout form fill."
            var jsonData = {
                date:  new Date(),
                title: "Fill session workout",
                description: msg,
                sentby: req.user._id || "-",
                sentto: userdata._id || "-",
            };
            var obj = {
                number: userdata.phoneno,
                body: (msg || ""),
                data: jsonData
            }
            let smsresult = SendTextMessage(obj);
            return res.status(200).json({ status: 1, message: "Save workout successfully." });
        }
        return res.status(200).json({ status: 2, message: "Request not found." });
    }
    catch (err) {
        errorLog("workout", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
module.exports = { ScheduleRequestUpdate, SessionActiveStatusUpdate, getSessionRequest, workout };