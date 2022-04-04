const VideoSessionsDetails = require("../../Model/Meeting/VideoSession");
const Trainers = require("../../Model/Trainer/UserSchema");
const Users = require("../../Model/Client/UserSchema");
const { errorLog } = require("../Errorcontroller");
const mongoose = require('mongoose');

////VideoSession Sattus
//// 0 - Start meeting but join not other
//// 1 - join meeting both
//// 2 - Close meeting
//// 3 - Disconnect meeting
const startvideosession = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });
        console.log(req.user)
        console.log(req.body)
        if ((req.user.role == "client")) {
            const userdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(req.body.toid) });
            if (userdata) {
                userdata.videostatus = 1;
                userdata.meetingid = (req.body.meetingid || "").toString();
                userdata.save();

                //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
            }
        } else {
            const userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(req.body.toid) });
            console.log(userdata)
            if (userdata) {
                userdata.videostatus = 1;
                userdata.meetingid = (req.body.meetingid || "").toString();
                userdata.save();

                //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
            }
        }

        const videosessionInput = {
            meetingid: req.body.meetingid,
            sessionid: req.body.sessionid,
            fromid: req.body.fromid,
            toid: req.body.toid,
            starttime: req.body.starttime
        }
        const VideoSessionsRequest = new VideoSessionsDetails(videosessionInput);
        await VideoSessionsRequest.save()
            .then((data) => {
                res.status(200).json({ status: 1, message: "Video sessions start successfully.", result: data });
            })
            .catch(function (error) {
                errorLog("startvideosession", req.body, error);
                res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
            });

    }
    catch (err) {
        errorLog("startvideosession", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const endvideosession = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });
        const videoSessionsdata = await VideoSessionsDetails.findOne({ meetingid: req.body.meetingid });
        let type = "";
        if (videoSessionsdata.toid == req.body.id) {
            type = "to";
        } else {
            type = "from";
        }

        if ((type == "to")) {
            if ((req.user.role == "trainer")) {
                const userdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });
                if (userdata) {
                    userdata.videostatus = 0;
                    userdata.meetingid = "";
                    userdata.save();

                    //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
                }
            } else {
                const userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });
                if (userdata) {
                    userdata.videostatus = 0;
                    userdata.meetingid = "";
                    userdata.save();

                    //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
                }
            }
        } else {
            if ((req.user.role == "client")) {
                const userdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.toid) });
                if (userdata) {
                    userdata.videostatus = 0;
                    userdata.meetingid = "";
                    userdata.save();

                    //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
                }
            } else {
                const userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.toid) });
                if (userdata) {
                    userdata.videostatus = 0;
                    userdata.meetingid = "";
                    userdata.save();

                    //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
                }
            }
        }

        if (videoSessionsdata) {
            videoSessionsdata.statusid = 2;
            videoSessionsdata.save();

            return res.status(200).json({ status: 1, message: "Video sessions end successfully.", result: videoSessionsdata });
        }
    }
    catch (err) {
        errorLog("endvideosession", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const joinvideosession = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const videoSessionsdata = await VideoSessionsDetails.findOne({ meetingid: req.body.meetingid });

        if (videoSessionsdata) {
            videoSessionsdata.statusid = 1;
            videoSessionsdata.save();

            return res.status(200).json({ status: 1, message: "Video sessions join successfully." });
        }
    }
    catch (err) {
        errorLog("joinvideosession", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const disconnectvideosession = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });
        const videoSessionsdata = await VideoSessionsDetails.findOne({ meetingid: req.body.meetingid });
        if ((req.body.type == "to")) {
            if ((req.user.role == "trainer")) {
                const userdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(req.body.toid) });
                if (userdata) {
                    userdata.videostatus = 0;
                    userdata.meetingid = "";
                    userdata.save();

                    //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
                }
            } else {
                const userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(req.body.toid) });
                if (userdata) {
                    userdata.videostatus = 0;
                    userdata.meetingid = "";
                    userdata.save();

                    //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
                }
            }
        } else {
            if ((req.user.role == "client")) {
                const userdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.toid) });
                if (userdata) {
                    userdata.videostatus = 0;
                    userdata.meetingid = "";
                    userdata.save();

                    //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
                }
            } else {
                const userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.toid) });
                if (userdata) {
                    userdata.videostatus = 0;
                    userdata.meetingid = "";
                    userdata.save();

                    //return res.status(200).json({ status: 1, message: "Video sessions start successfully." });
                }
            }
        }



        if (videoSessionsdata) {
            videoSessionsdata.statusid = (req.body.type == "to") ? 3 : 4;
            videoSessionsdata.save();

            return res.status(200).json({ status: 1, message: "Video sessions disconnect successfully." });
        }
    }
    catch (err) {
        errorLog("disconnectvideosession", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getconnectvideosession = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });
        const videoSessionsdata = await VideoSessionsDetails.findOne({ meetingid: req.body.meetingid });
        var userdata = {};
        var ruserdata = {};
        if (videoSessionsdata.fromid == req.user._id && req.user.role == "client") {
            userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.fromid) });
            ruserdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.toid) });
        } else if (videoSessionsdata.fromid == req.user._id && req.user.role != "client") {
            userdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.fromid) });
            ruserdata = await Users.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.toid) });
        } else if (videoSessionsdata.toid == req.user._id && req.user.role == "client") {
            userdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.fromid) });
            ruserdata = await Users.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.toid) });
        } else if (videoSessionsdata.toid == req.user._id && req.user.role != "client") {
            userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.fromid) });
            ruserdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(videoSessionsdata.toid) });
        }
        var resObj = {
            videoSessions: videoSessionsdata,
            senderData: userdata,
            receiverData: ruserdata
        }
        if (videoSessionsdata) {
            return res.status(200).json({ status: 1, message: "Get Video sessions successfully.", result: resObj });
        }
        return res.status(200).json({ status: 2, message: "meeting not found." });
    }
    catch (err) {
        errorLog("getconnectvideosession", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getvideosessionlist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });
        console.log(req.user)

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;
        var resultObj = {
            list: [],
            count: 0
        }
        if (req.user.role == "client") {
            const fromVideoSessionsdata = await VideoSessionsDetails.aggregate([
                { $match: { fromid: req.user._id } },
                { $sort: { starttime: -1 } },
                { "$addFields": { "tId": { "$toObjectId": "$toid" }, "cId": { "$toObjectId": "$fromid" } } },
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
                //       paginatedResults: [
                //         { $skip: (pageNumber - 1) * limitValue },
                //         { $limit: limitValue },
                //       ],
                //       totalCount: [
                //         {
                //           $count: 'count'
                //         }
                //       ]
                //     }
                // }
            ]);
            const toVideoSessionsdata = await VideoSessionsDetails.aggregate([
                { $match: { toid: req.user._id } },
                { $sort: { starttime: -1 } },
                { "$addFields": { "tId": { "$toObjectId": "$fromid" }, "cId": { "$toObjectId": "$toid" } } },
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
                //       paginatedResults: [
                //         { $skip: (pageNumber - 1) * limitValue },
                //         { $limit: limitValue },
                //       ],
                //       totalCount: [
                //         {
                //           $count: 'count'
                //         }
                //       ]
                //     }
                // }
            ]);
            var lst = fromVideoSessionsdata.concat(toVideoSessionsdata);
            resultObj.list = lst.slice(((pageNumber - 1) * limitValue), (((pageNumber - 1) * limitValue)+limitValue));
            resultObj.count  = lst.length || 0;
            if (resultObj) {
                return res.status(200).json({ status: 1, message: "Get Video sessions list successfully.", result: resultObj });
            }
        } else {
            const fromVideoSessionsdata = await VideoSessionsDetails.aggregate([
                { $match: { fromid: req.user._id } },
                { $sort: { starttime: -1 } },
                { "$addFields": { "tId": { "$toObjectId": "$fromid" }, "cId": { "$toObjectId": "$toid" } } },
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
                //       paginatedResults: [
                //         { $skip: (pageNumber - 1) * limitValue },
                //         { $limit: limitValue },
                //       ],
                //       totalCount: [
                //         {
                //           $count: 'count'
                //         }
                //       ]
                //     }
                // }
            ]);
            const toVideoSessionsdata = await VideoSessionsDetails.aggregate([
                { $match: { toid: req.user._id } },
                { $sort: { starttime: -1 } },
                { "$addFields": { "tId": { "$toObjectId": "$toid" }, "cId": { "$toObjectId": "$fromid" } } },
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
                //       paginatedResults: [
                //         { $skip: (pageNumber - 1) * limitValue },
                //         { $limit: limitValue },
                //       ],
                //       totalCount: [
                //         {
                //           $count: 'count'
                //         }
                //       ]
                //     }
                // }
            ]);
            var lst = fromVideoSessionsdata.concat(toVideoSessionsdata);
            resultObj.list = lst.slice(((pageNumber - 1) * limitValue), (((pageNumber - 1) * limitValue)+limitValue));
            resultObj.count  = lst.length || 0;
            if (resultObj) {
                return res.status(200).json({ status: 1, message: "Get Video sessions list successfully.", result: resultObj });
            }
        }
        return res.status(200).json({ status: 2, message: "meeting not found." });
    }
    catch (err) {
        errorLog("getvideosessionlist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
module.exports = { startvideosession, endvideosession, joinvideosession, disconnectvideosession, getconnectvideosession, getvideosessionlist };