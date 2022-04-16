const SessionRequestSchema = require("../../Model/Client/SessionRequestSchema");
const Users = require("../../Model/Trainer/UserSchema");
const Trainers = require("../../Model/Trainer/UserSchema");
const { SendTextMessage } = require("../SMSController");
const mongoose = require('mongoose');
const { errorLog } = require("../Errorcontroller");

const SessionRequest = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const sessionrequestInput = {
            userid: req.user._id,
            trainerid: req.body.trainerid,
            date: req.body.date,
            starthour: req.body.starthour,
            endhour: req.body.endhour,
            startdatetime: req.body.startdatetime,
            enddatetime: req.body.enddatetime,
            requeststatus: 0,
            requestType: req.body.requestType,
            reason: ""
        };
        //const userdata = await Users.findOne({ _id:  mongoose.Types.ObjectId(sessionrequestInput.userid) });
        const trainerdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(sessionrequestInput.trainerid) });
        const sessionrequest = new SessionRequestSchema(sessionrequestInput);

        await sessionrequest.save()
            .then((data) => {

                // Client SMS Code
                const userdata = Users.findOne({ _id: mongoose.Types.ObjectId(sessionrequestInput.userid) });
                let msg = userdata.firstname + " your session request is sent successfully."
                var jsonData = {
                    date: new Date(),
                    title: "Session request By Sender",
                    description: msg,
                    type: req.user,
                    sentby: req.user._id || "-",
                    sentto: userdata._id || "-",
                };
                var obj = {
                    number: userdata.phoneno,
                    body: (msg || ""),
                    data: jsonData
                }
                let smsresult = SendTextMessage(obj);
                // Trainer SMS Code
                let msg1 = trainerdata.firstname + " you get new session request successfully."
                var jsonData1 = {
                    date: new Date(),
                    title: "Session request To receiver",
                    description: msg1,
                    type: req.user,
                    sentby: req.user._id || "-",
                    sentto: trainerdata._id || "-",
                };
                var obj1 = {
                    number: trainerdata.phoneno,
                    body: (msg1 || ""),
                    data: jsonData1
                }
                let smsresult1 = SendTextMessage(obj1);

                res.status(200).json({ status: 1, message: "Requested successfully.", result: data });
            })
            .catch(function (error) {
                errorLog("SessionRequest", req.body, error);
                res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
            });
    }
    catch (err) {
        errorLog("SessionRequest", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getSessionByid = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        var mtobj = { _id: mongoose.Types.ObjectId(req.body.id) }
        const sessionRequestlist = await SessionRequestSchema.aggregate([
            { $match: mtobj },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "client_data"
                }
            },
            { $unwind: "$client_data" }
        ]);
        const rankinglist = await SessionRequestSchema.find({ trainerid: sessionRequestlist[0].trainerid, sessionrating: { $exists: true, $not: { $size: 0 } } });
        var resObj = {
            sessionrequestlist: sessionRequestlist,
            rankinglist: rankinglist
        }
        return res.status(200).json({ status: 1, message: "Get session successfully.", result: resObj });
    }
    catch (err) {
        errorLog("getSessionByid", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getClientSession = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        // const limitValue = req.body.limitValue || 10;
        // const pageNumber = req.body.pageNumber || 1;

        var d = new Date();
        d.setHours(0, 0, 0, 0);

        const upcommingSessionlist = await SessionRequestSchema.aggregate([
            { $match: { requeststatus: 1, userid: req.user._id, date: { $gte: d } } },
            { $sort: { date: -1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" },
            // {
            //     $facet: {
            //         paginatedResults: [
            //             { $skip: (pageNumber - 1) * limitValue },
            //             { $limit: limitValue },
            //         ],
            //         totalCount: [
            //             {
            //                 $count: 'count'
            //             }
            //         ]
            //     }
            // }
        ]);
        var dd = new Date(d.setDate(d.getDate() + 1));
        const compeletedSessionlist = await SessionRequestSchema.aggregate([
            { $match: { requeststatus: 1, userid: req.user._id, date: { $lte: dd } } },
            { $sort: { date: -1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" },
            // {
            //     $facet: {
            //         paginatedResults: [
            //             { $skip: (pageNumber - 1) * limitValue },
            //             { $limit: limitValue },
            //         ],
            //         totalCount: [
            //             {
            //                 $count: 'count'
            //             }
            //         ]
            //     }
            // }
        ]);
        const objRes = {
            upcomingList: upcommingSessionlist || [],
            completedList: compeletedSessionlist || []
        }
        return res.status(200).json({ status: 1, message: "Get successfully.", result: objRes });
    }
    catch (err) {
        errorLog("getClientSession", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getUpcommingSession = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var d = new Date();
        const upcommingSessionlist = await SessionRequestSchema.aggregate([
            {
                $match: { requeststatus: 1, userid: req.user._id, enddatetime: { $gte: d } }
            },
            { $sort: { date: 1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
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
        return res.status(200).json({ status: 1, message: "Get successfully.", result: upcommingSessionlist });
    }
    catch (err) {
        errorLog("getClientSession", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getCompeletedSession = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;
        var d = new Date();
        const compeletedSessionlist = await SessionRequestSchema.aggregate([
            { $match: { requeststatus: 1, userid: req.user._id, enddatetime: { $lt: d } } },
            { $sort: { date: -1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
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

        return res.status(200).json({ status: 1, message: "Get successfully.", result: compeletedSessionlist });
    }
    catch (err) {
        errorLog("getClientSession", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getworkout = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        //const scheduleRequestInput = await SessionRequestSchema.findOne({ _id: req.body.id });
        const scheduleRequestInput = await SessionRequestSchema.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.body.id) } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" }
        ]);
        if (scheduleRequestInput) {
            return res.status(200).json({ status: 1, message: "Get Session successfully.", result: scheduleRequestInput });
        }
        return res.status(200).json({ status: 2, message: "Request not found." });
    }
    catch (err) {
        errorLog("getworkout", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getworkoutlist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        //const scheduleRequestInput = await SessionRequestSchema.findOne({ _id: req.body.id });
        const scheduleRequestInput = await SessionRequestSchema.aggregate([
            //{ $match: { userid:  mongoose.Types.ObjectId(req.user._id) } },
            { $match: { sessionworkout: { $exists: true, $not: { $size: 0 } } } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" }, "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "client_data"
                }
            },
            { $unwind: "$client_data" }
        ]);
        if (scheduleRequestInput) {
            return res.status(200).json({ status: 1, message: "Get workout list successfully.", result: scheduleRequestInput });
        }
        return res.status(200).json({ status: 2, message: "Request not found." });
    }
    catch (err) {
        errorLog("getworkoutlist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const rating = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const sessionRequestInput = await SessionRequestSchema.findOne({ _id: req.body.id });
        if (sessionRequestInput) {
            sessionRequestInput.sessionrating = req.body;
            sessionRequestInput.save();
            return res.status(200).json({ status: 1, message: "Save rating successfully." });
        }
        return res.status(200).json({ status: 2, message: "Request not found." });
    }
    catch (err) {
        errorLog("rating", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

module.exports = { SessionRequest, getSessionByid, getworkout, getworkoutlist, rating, getClientSession, getUpcommingSession, getCompeletedSession };