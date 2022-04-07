const WorkoutCategory = require("../../Model/Admin/WorkoutCategorySchema");
const Users = require("../../Model/Trainer/UserSchema");
const Client = require("../../Model/Client/UserSchema");
const ScheduleRequestSchema = require("../../Model/Client/SessionRequestSchema");
const { errorLog } = require("../Errorcontroller");

const deletetrainer = async (req, res) => {
    if (!req.user.isAuthenticated)
        return res.status(200).json({ status: 2, message: "Please login to get clients." });
    await Users.findOne({ "_id": req.body._id }).then((userdata) => {
        Users.deleteOne({ "_id": req.body._id }).then((deleteddata) => {
            if (deleteddata.deletedCount === 1) {
                return res.json({ status: 1, message: "Trainer deleted successfully.", result: {} });
            }
        }).catch(function (error) {
            errorLog("deletetrainer", req.body, error);
            return res.json({ status: 2, message: error, result: {} });
        });
    }).catch(function (err) {
        errorLog("deletetrainer", req.body, err);
        return res.json({ status: 2, message: err, result: {} });
    });
};

const trainer = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get trainer." });

        // const limitValue = req.body.limitValue || 10;
        // const pageNumber = req.body.pageNumber || 1;

        const clientlist = await Client.findById({ _id: req.user._id });
        const rankinglist = await ScheduleRequestSchema.find({ sessionrating: { $exists: true, $not: { $size: 0 } } });

        // if (req.body.isfilter === true) {
        //     console.log(req.body);
        //     req.body.ratings = (req.body.ratings === '') ? 1 : req.body.ratings;
        //     try {
        //         var filter = { statusid: 1, availablestatus: req.body.availablestatus };
        //         if (req.body.gender && req.body.gender != '')
        //             filter.gender = req.body.gender;
        //         if (req.body.type && req.body.type != '')
        //             filter.type = req.body.type;

        //         const Users1 = await Users.aggregate([
        //             { $match: filter },
        //             // JOIN WITH SESSIONREQUEST
        //             { "$addFields": { "tId": { "$toString": "$_id" } } },
        //             {
        //                 $lookup: {
        //                     from: "sessionrequests",
        //                     localField: "tId",
        //                     foreignField: "trainerid",
        //                     //let: { trainerid: "$tId" },
        //                     // pipeline: [{
        //                     //     $match: {
        //                     //         //$expr: { $eq: ["$$trainerid", "$trainerid"] },
        //                     //         sessionrating: { $exists: true }
        //                     //     }
        //                     // }
        //                     // ],
        //                     as: "session_data",
        //                 }
        //             },
        //             //{ $match: { "session_data.sessionrating": { $ne: {} } } },
        //             //{ $match: { "session_data.sessionrating": { $ne: null } } },
        //             // { $unwind: "$session_data.sessionrating" },
        //             // {
        //             //     $project: {
        //             //         _id: 1, firstname: 1,
        //             //         rate: {
        //             //             $cond:
        //             //                 [
        //             //                     { $ifNull: ['$session_data.sessionrating', false] }, 0, "$session_data.sessionrating.rate"
        //             //                     // if: { $eq: ["$session_data", false] },
        //             //                     // then: 0,
        //             //                     // else: "$session_data.sessionrating.rate"
        //             //                 ]
        //             //         }
        //             //     }
        //             // },
        //             { $unwind: { path: "$session_data.sessionrating", preserveNullAndEmptyArrays: true } },
        //             {
        //                 $project: {
        //                     averageRating: {
        //                         $cond: {
        //                             if: { $eq: [{ $divide: [{ $avg: "$session_data.sessionrating.rate" }, 20] }, null] },
        //                             then: 0,
        //                             else: { $divide: [{ $avg: "$session_data.sessionrating.rate" }, 20] }
        //                         }
        //                     },
        //                     _id: 1,
        //                     firstname: 1,
        //                     lastname: 1,
        //                     profile: 1,
        //                     trainingstyle: 1,
        //                     availablestatus: 1,
        //                     type: 1
        //                 },
        //             },
        //             {
        //                 $sort: { averageRating: parseInt(req.body.ratings) }
        //             },
        //             // {
        //             //     $group: {
        //             //         _id: '$tId', "firstname": { "$first": "$firstname" }, avg: {
        //             //             $avg: {
        //             //                 $cond:
        //             //                     [
        //             //                         { $ifNull: ['$session_data.sessionrating.rate', true] }, 0, "$session_data.sessionrating.rate"
        //             //                     ]
        //             //                 // {
        //             //                 //     if: { $eq: ["$session_data", false] },
        //             //                 //     then: 0,
        //             //                 //     else: "$session_data.sessionrating.rate"
        //             //                 // }
        //             //             }
        //             //         }
        //             //     }
        //             // },
        //             {
        //                 $facet: {
        //                     paginatedResults: [
        //                         { $skip: (pageNumber - 1) * limitValue },
        //                         { $limit: limitValue },
        //                     ],
        //                     totalCount: [
        //                         {
        //                             $count: 'count'
        //                         }
        //                     ]
        //                 }
        //             }
        //         ]);

        //         console.log("Users1 Data:", JSON.stringify(Users1));
        //     }
        //     catch (err) {
        //         console.log("Users1 Error", err);
        //     }
        // }

        var resObj = {
            trainerlist: [],
            client_data: clientlist,
            rankinglist: rankinglist
        }
        if (req.body.isfilter === true) {
            var filterObj = { statusid: 1 };
            //filterObj.experience = (req.body.isStandardTrainers == true) ? { $gte: 3 } : { $lt: 3 };
            if (req.body.isStandardTrainers == true)
                filterObj.type = "Standard";
            else if (req.body.isStandardTrainers == false)
                filterObj.type = "ELite";
            if (req.body.name && req.body.name != '')
                filterObj.firstname = { $regex: '.*' + req.body.name + '.*' };
            if (req.body.ratings && req.body.ratings != '')
                filterObj.ratings = req.body.ratings;
            if (req.body.typeOfWorkout && req.body.typeOfWorkout != '')
                filterObj.typeOfWorkout = req.body.typeOfWorkout;
            if (req.body.gender && req.body.gender != '')
                filterObj.gender = req.body.gender;
            const trainerlist = await Users.find(filterObj);
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        else if (req.body.availablestatus === 0) {
            const trainerlist = await Users.find({ statusid: 1, availablestatus: req.body.availablestatus });
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        else if (req.body.availablestatus === -1 && req.body.id != null) {
            const trainerlist = await Users.find({ statusid: 1, _id: req.body.id });
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        else {
            const trainerlist = await Users.find({ statusid: 1, availablestatus: req.body.availablestatus });
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        return res.status(200).json({ status: 2, message: "Trainer not found." });
    }
    catch (err) {
        errorLog("trainer", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const savetrainerlist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get trainer." });

        const clientlist = await Client.findById({ _id: req.user._id });
        var resObj = {
            trainerlist: [],
            client_data: clientlist
        }
        if (req.body.availablestatus === 0) {
            const trainerlist = await Users.find({ statusid: 1, _id: { $in: (clientlist.bookmarktrainer || []) } });
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        else {
            const trainerlist = await Users.find({ statusid: 1, availablestatus: req.body.availablestatus, _id: { $in: (clientlist.bookmarktrainer || []) } });
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        return res.status(200).json({ status: 2, message: "Trainer not found." });
    }
    catch (err) {
        errorLog("savetrainerlist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const savetrainer = async (req, res) => {
    console.log(req.body);
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to update trainer." });
        const userdata = await Users.findOne({ _id: req.body._id });
        if (userdata) {
            userdata.firstname = req.body.firstname;
            userdata.lastname = req.body.lastname;
            //userdata.email = req.body.email;
            //userdata.phoneno = req.body.phoneno;
            userdata.gender = req.body.gender;
            userdata.statusid = req.body.isactive;
            userdata.type = req.body.type;
            userdata.save().then(function () {
                return res.status(200).json({ status: 1, message: "Updated successfully." });
            })
                .catch(function (error) {
                    errorLog("savetrainer", req.body, error);
                });
        }
        //return res.status(200).json({ status: 1, message: "Updated successfully." });
    }
    catch (err) {
        errorLog("savetrainer", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const searchtrainer = async (req, res) => {
    try {
        //console.log('Controller');
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to save trainer." });
        if (req.body.searchname !== "") {
            let searchtext = "/.*" + req.body.searchname + ".*/";
            const regExp = new RegExp(eval(searchtext), "i")
            const trainerlist = await Users.find({ $or: [{ firstname: regExp }, { lastname: regExp }, { email: regExp }, { phoneno: regExp }] }).collation({ locale: 'en' }).sort({ firstname: 1 });
            if (trainerlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: trainerlist });
        }
        else if (req.body.availablestatus === 0) {
            const trainerlist = await Users.find({ status: 1 });
            if (clientlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: trainerlist });
        }
        else {
            const trainerlist = await Users.find({ status: 1, availablestatus: req.body.availablestatus });
            if (trainerlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: trainerlist });
        }
        return res.status(200).json({ status: 2, message: "trainer not found.", result: [] });
    }
    catch (err) {
        errorLog("searchtrainer", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const trainerdetails = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get trainer." });

        const clientlist = await Client.findById({ _id: req.user._id });
        const sessionRequestlist = await ScheduleRequestSchema.aggregate([
            { $match: { requeststatus: 1, userid: req.user._id } },
            { $sort: { _id: -1 } },
            { "$addFields": { "tId": { "$toObjectId": "$trainerid" } } },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" }
        ]);

        var resObj = {
            trainerlist: [],
            sessionrequestlist: sessionRequestlist,
            client_bm_data: (clientlist) ? ((clientlist.bookmarktrainer) ? clientlist.bookmarktrainer : {}) : {}
        }
        if (req.body.availablestatus === 0) {
            const trainerlist = await Users.find({ status: 1 });
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        else if (req.body.userId !== "") {
            const trainerlist = await Users.findById({ _id: req.body.userId });
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        else {
            const trainerlist = await Users.find({ status: 1, availablestatus: req.body.availablestatus });
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        return res.status(200).json({ status: 2, message: "client not found.", result: [] });
    }
    catch (err) {
        errorLog("trainerdetails", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const trainerrating = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        //const trainerlist = await ScheduleRequestSchema.find({ trainerid: req.user._id });
        const trainerlist = await ScheduleRequestSchema.aggregate([
            { $match: { trainerid: req.user._id, sessionrating: { $exists: true, $not: { $size: 0 } } } },
            { "$addFields": { "cId": { "$toObjectId": "$userid" } } },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "client_data"
                }
            },
            { $unwind: "$client_data" },
        ]);
        if (trainerlist) {
            console.log(trainerlist)
            return res.status(200).json({ status: 1, message: "Get session successfully.", result: trainerlist });
        }
        return res.status(200).json({ status: 1, message: "Get session successfully.", result: [] });
    }
    catch (err) {
        errorLog("trainerrating", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
}

const getworkoutcategory = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const adminlist = await WorkoutCategory.find({ active: true });
        if (adminlist)
            return res.status(200).json({ status: 1, message: "Get Workout Categorysuccessfully.", result: adminlist });

        return res.status(200).json({ status: 2, message: "WorkoutC ategory not found.", result: [] });
    }
    catch (err) {
        errorLog("getworkoutcategory", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

module.exports = { trainer, savetrainerlist, deletetrainer, searchtrainer, savetrainer, trainerrating, trainerdetails, getworkoutcategory };