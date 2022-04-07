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
            const userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(scheduleRequestInput.userid) });
            const trainerdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(scheduleRequestInput.trainerid) });
            // Client SMS Code
            if (req.body.status != 1) {
                let msg = userdata.firstname + " your session request is reject by " + trainerdata.firstname + "."
                var jsonData = {
                    date: new Date(),
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
        const sessionRequestlist = await ScheduleRequestSchema.aggregate([
            { $match: { requeststatus: 0, trainerid: req.user._id, date: { $gte: d } } },
            { $sort: { date: -1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
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
        const sessionAcceptlist = await ScheduleRequestSchema.aggregate([
            { $match: { requeststatus: 1, trainerid: req.user._id, date: { $gte: d } } },
            { $sort: { date: -1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
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

const getPendingRequest = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var d = new Date();
        console.log(d)
        const sessionRequestlist = await ScheduleRequestSchema.aggregate([
            { $match: { requeststatus: 0, trainerid: req.user._id, enddatetime: { $gte: d } } },
            { $sort: { date: 1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: (pageNumber - 1) * limitValue },
                        { $limit: limitValue },
                    ],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }
        ]);
        return res.status(200).json({ status: 1, message: "Get successfully.", result: sessionRequestlist });
    }
    catch (err) {
        errorLog("getPendingRequest", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getAcceptRequest = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var d = new Date();
        const sessionAcceptlist = await ScheduleRequestSchema.aggregate([
            { $match: { requeststatus: 1, trainerid: req.user._id, enddatetime: { $gte: d } } },
            { $sort: { date: 1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" },
            {
                $project: {
                    cId: 1,
                    createdAt: 1,
                    date: 1,
                    enddatetime: 1,
                    endhour: 1,
                    reason: 1,
                    requeststatus: 1,
                    startdatetime: 1,
                    starthour: 1,
                    tId: 1,
                    trainerid: 1,
                    updatedAt: 1,
                    user_data: 1,
                    userid: 1,
                    _id: 1,
                    isVideocall: {
                        $cond: {
                            if: { $gte: ["$enddatetime", d]} && { $lt: ["$startdatetime",d] },
                            then: 1,
                            else: 0
                        }
                    }
                }
            },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: (pageNumber - 1) * limitValue },
                        { $limit: limitValue },
                    ],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }
        ]);
        return res.status(200).json({ status: 1, message: "Get successfully.", result: sessionAcceptlist });
    }
    catch (err) {
        errorLog("getAcceptRequest", req.body, err);
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
                date: new Date(),
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

module.exports = { ScheduleRequestUpdate, SessionActiveStatusUpdate, getSessionRequest, workout, getPendingRequest, getAcceptRequest };