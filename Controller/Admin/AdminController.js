const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const Cryptr = require("cryptr");
const path = require("path");
const JWTSECRET = process.env.JWTSECRET;
const ENCRYPTSECRET = process.env.ENCRYPTSECRET;
const WEBRESETPASSWORDHOST = process.env.WEBRESETPASSWORDHOST;
const { errorLog } = require("../Errorcontroller");
const cryptr = new Cryptr(ENCRYPTSECRET);

const WorkoutCategory = require("../../Model/Admin/WorkoutCategorySchema");
const ScheduleRequestSchema = require("../../Model/Client/SessionRequestSchema");
const StaffSchema = require("../../Model/Admin/StaffSchema");
const GoalsSchema = require("../../Model/Admin/GoalsSchema");
const EquipmentSchema = require("../../Model/Admin/EquipmentSchema");
const PlanSchema = require("../../Model/Admin/PlanSchema");
const Client = require("../../Model/Client/UserSchema");
const Users = require("../../Model/Trainer/UserSchema");
const Notifications = require("../../Model/Admin/NotificationSchema");
const Setting = require("../../Model/Admin/SettingSchema");
const Movement = require("../../Model/Admin/MovementSchema");
const Country = require("../../Model/Admin/CountrySchema");

const mongoose = require('mongoose');
const getworkoutcategory = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        var resObj = {
            workoutcategory: [],
            noOfRecords: await WorkoutCategory.estimatedDocumentCount({ active: true })
        }
        const adminlist = await WorkoutCategory.find({ active: true }).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
        if (adminlist) {
            resObj.workoutcategory = adminlist;
            return res.status(200).json({ status: 1, message: "Get Workout Categorysuccessfully.", result: resObj });
        }
        return res.status(200).json({ status: 2, message: "Workout Category not found.", result: resObj });
    }
    catch (err) {
        errorLog("getworkoutcategory", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const saveworkoutcategory = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const wocatlist = await WorkoutCategory.findById({ _id: mongoose.Types.ObjectId(req.body.id) });
        if (wocatlist) {
            wocatlist.name = req.body.name;
            wocatlist.status = req.body.status;
            wocatlist.save();
            return res.status(200).json({ status: 1, message: "Workout Category update successfully." });
        } else {
            const workoutInput = {
                name: req.body.name,
                status: req.body.status
            };
            const workout = new WorkoutCategory(workoutInput);
            await workout.save()
                .then((data) => {
                    res.status(200).json({ status: 1, message: "Workout Category insert successfully.", result: data });
                })
                .catch(function (error) {
                    res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
                });
        }
    }
    catch (err) {
        errorLog("saveworkoutcategory", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const deleteworkoutcategory = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const wocatlist = await WorkoutCategory.findById({ _id: req.body.id });
        if (wocatlist) {
            wocatlist.deleteOne({ _id: req.body.id });
            return res.status(200).json({ status: 1, message: "Workout Category delete successfully." });
        }
        return res.status(200).json({ status: 2, message: "Workout Category not found.", result: [] });
    }
    catch (err) {
        errorLog("deleteworkoutcategory", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const getstaff = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });
        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        var resObj = {
            stafflist: [],
            noOfRecords: await StaffSchema.estimatedDocumentCount()
        }

        const stafflist = await StaffSchema.find({}).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
        if (stafflist) {
            resObj.stafflist = stafflist;
            return res.status(200).json({ status: 1, message: "Get Staff successfully.", result: resObj });
        }
        return res.status(200).json({ status: 2, message: "Staff not found.", result: resObj });
    }
    catch (err) {
        errorLog("getstaff", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const savestaff = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const stafflist = await StaffSchema.findById({ _id: mongoose.Types.ObjectId(req.body.id) });
        if (stafflist) {
            stafflist.firstname = req.body.firstname;
            stafflist.lastname = req.body.lastname;
            stafflist.email = req.body.email;
            //stafflist.password = req.body.password;
            stafflist.phoneno = req.body.phoneno;
            stafflist.age = req.body.age;
            stafflist.gender = req.body.gender;
            stafflist.statusid = (req.body.status) ? 1 : 0;
            stafflist.save();
            return res.status(200).json({ status: 1, message: "Staff update successfully.", result: stafflist });
        } else {
            const salt = await bcrypt.genSalt(3);
            const hashpassword = await bcrypt.hash(req.body.password, salt);
            const staffInput = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashpassword,
                phoneno: req.body.phoneno,
                age: req.body.age,
                gender: req.body.gender,
                statusid: 1
            };
            const stafflist = new StaffSchema(staffInput);
            await stafflist.save()
                .then((data) => {
                    res.status(200).json({ status: 1, message: "Staff insert successfully.", result: stafflist });
                })
                .catch(function (error) {
                    res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
                });
        }
    }
    catch (err) {
        errorLog("savestaff", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const deletestaff = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const stafflist = await StaffSchema.findById({ _id: req.body.id });
        if (stafflist) {
            stafflist.deleteOne({ _id: req.body.id });
            return res.status(200).json({ status: 1, message: "Staff delete successfully." });
        }
        return res.status(200).json({ status: 2, message: "Staff not found.", result: [] });
    }
    catch (err) {
        errorLog("deletestaff", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const getgoalstypes = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });
        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        var resObj = {
            goalslist: [],
            noOfRecords: await GoalsSchema.estimatedDocumentCount()
        }

        const goalslist = await GoalsSchema.find({}).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
        if (goalslist) {
            resObj.goalslist = goalslist;
            return res.status(200).json({ status: 1, message: "Get Goals type successfully.", result: resObj });
        }
        return res.status(200).json({ status: 2, message: "Goals type not found.", result: resObj });
    }
    catch (err) {
        errorLog("getgoalstypes", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const savegoalstypes = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const goalslist = await GoalsSchema.findById({ _id: mongoose.Types.ObjectId(req.body.id) });
        if (goalslist) {
            goalslist.name = req.body.name;
            goalslist.statusid = (req.body.status) ? 1 : 0;
            goalslist.save();
            return res.status(200).json({ status: 1, message: "Goals type update successfully.", result: goalslist });
        } else {
            const goalsInput = {
                name: req.body.name,
                statusid: 1
            };
            const goalslist = new GoalsSchema(goalsInput);
            await goalslist.save()
                .then((data) => {
                    res.status(200).json({ status: 1, message: "Goals type insert successfully.", result: goalslist });
                })
                .catch(function (error) {
                    res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
                });
        }
    }
    catch (err) {
        errorLog("savegoalstypes", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const deletegoalstypes = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const goalslist = await GoalsSchema.findById({ _id: req.body.id });
        if (goalslist) {
            goalslist.deleteOne({ _id: req.body.id });
            return res.status(200).json({ status: 1, message: "Goals type delete successfully." });
        }
        return res.status(200).json({ status: 2, message: "Goals type not found.", result: [] });
    }
    catch (err) {
        errorLog("deletegoalstypes", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const getequipments = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });
        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        var resObj = {
            goalslist: [],
            noOfRecords: await EquipmentSchema.estimatedDocumentCount()
        }

        const goalslist = await EquipmentSchema.find({}).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
        if (goalslist) {
            resObj.goalslist = goalslist;
            return res.status(200).json({ status: 1, message: "Get Equipment successfully.", result: resObj });
        }
        resObj.goalslist = [];
        return res.status(200).json({ status: 2, message: "Equipment type not found.", result: resObj });
    }
    catch (err) {
        errorLog("getequipments", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const saveequipments = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const equplist = await EquipmentSchema.findById({ _id: mongoose.Types.ObjectId(req.body.id) });
        if (equplist) {
            equplist.name = req.body.name;
            equplist.statusid = (req.body.status) ? 1 : 0;
            equplist.save();
            return res.status(200).json({ status: 1, message: "Equipment update successfully.", result: equplist });
        } else {
            const equpInput = {
                name: req.body.name,
                statusid: 1
            };
            const equplist = new EquipmentSchema(equpInput);
            await equplist.save()
                .then((data) => {
                    res.status(200).json({ status: 1, message: "Equipment insert successfully.", result: equplist });
                })
                .catch(function (error) {
                    res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
                });
        }
    }
    catch (err) {
        errorLog("saveequipments", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const deleteequipments = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const equplist = await EquipmentSchema.findById({ _id: req.body.id });
        if (equplist) {
            equplist.deleteOne({ _id: req.body.id });
            return res.status(200).json({ status: 1, message: "Equipment delete successfully." });
        }
        return res.status(200).json({ status: 2, message: "Equipment not found.", result: [] });
    }
    catch (err) {
        errorLog("deleteequipments", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const getplan = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        var resObj = {
            planlist: [],
            noOfRecords: await PlanSchema.estimatedDocumentCount()
        }
        const planlist = await PlanSchema.find({}).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
        if (planlist) {
            resObj.planlist = planlist;
            return res.status(200).json({ status: 1, message: "Get Plan successfully.", result: resObj });
        }
        return res.status(200).json({ status: 2, message: "Plan not found.", result: resObj });
    }
    catch (err) {
        errorLog("getplan", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const saveplan = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const planlist = await PlanSchema.findById({ _id: mongoose.Types.ObjectId(req.body.id) });
        if (planlist) {
            planlist.plantype = req.body.plantype;
            planlist.noofsession = req.body.noofsession;
            planlist.amount = req.body.amount;
            planlist.tax = req.body.tax;
            planlist.statusid = (req.body.status) ? 1 : 0;
            planlist.save();
            return res.status(200).json({ status: 1, message: "Plan update successfully.", result: planlist });
        } else {
            const planInput = {
                plantype: req.body.plantype,
                noofsession: req.body.noofsession,
                amount: req.body.amount,
                tax: req.body.tax,
                statusid: 1
            };
            const planlist = new PlanSchema(planInput);
            await planlist.save()
                .then((data) => {
                    res.status(200).json({ status: 1, message: "Plan insert successfully.", result: planlist });
                })
                .catch(function (error) {
                    res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
                });
        }
    }
    catch (err) {
        errorLog("saveplan", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const deleteplan = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const planlist = await PlanSchema.findById({ _id: req.body.id });
        if (planlist) {
            planlist.deleteOne({ _id: req.body.id });
            return res.status(200).json({ status: 1, message: "Plan delete successfully." });
        }
        return res.status(200).json({ status: 2, message: "Plan not found.", result: [] });
    }
    catch (err) {
        errorLog("deleteplan", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const ratinglist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        const trainerlist = await ScheduleRequestSchema.aggregate([
            { $match: { sessionrating: { $exists: true, $not: { $size: 0 } } } },
            { $sort: sortObject },
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
        console.log(trainerlist)
        if (trainerlist) {
            return res.status(200).json({ status: 1, message: "Get rating successfully.", result: trainerlist });
        }
        return res.status(200).json({ status: 1, message: "Get rating successfully.", result: trainerlist });
    }
    catch (err) {
        errorLog("ratinglist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
}
const deleterating = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const sesreqlist = await ScheduleRequestSchema.findById({ _id: req.body.id });
        if (sesreqlist) {
            sesreqlist.sessionrating = undefined;
            sesreqlist.sessionrating.remove();
            sesreqlist.save();
            return res.status(200).json({ status: 1, message: "Rating delete successfully." });
        }
        return res.status(200).json({ status: 2, message: "Rating not found.", result: [] });
    }
    catch (err) {
        errorLog("deleterating", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const workoutlist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        const trainerlist = await ScheduleRequestSchema.aggregate([
            { $match: { sessionworkout: { $exists: true, $not: { $size: 0 } } } },
            { "$addFields": { "cId": { "$toObjectId": "$userid" }, "tId": { "$toObjectId": "$trainerid" } } },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "client_data"
                }
            },
            { $unwind: "$client_data" },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
            { $sort: sortObject },
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
        if (trainerlist) {
            return res.status(200).json({ status: 1, message: "Get workout successfully.", result: trainerlist });
        }
        return res.status(200).json({ status: 1, message: "Get workout successfully.", result: trainerlist });
    }
    catch (err) {
        errorLog("workoutlist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
}
const trainerlist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "firstname";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        const rankinglist = await ScheduleRequestSchema.find({ sessionrating: { $exists: true, $not: { $size: 0 } } });
        var resObj = {
            trainerlist: [],
            rankinglist: rankinglist,
            noOfRecords: await Users.estimatedDocumentCount()
        }
        if (req.body.isfilter === true) {
            var filterObj = { statusid: 1 };
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
            const trainerlist = await Users.find(filterObj).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                //resObj.noOfPage = CalcPagesCount(trainerlist.length,limitValue);
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        else if (req.body.availablestatus === 0) {
            const trainerlist = await Users.find({ statusid: 1 }).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                //resObj.noOfPage = CalcPagesCount(trainerlist.length,limitValue);
                //console.log(resObj.noOfPage)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        else if (req.body.availablestatus === -1 && req.body.id != null) {
            const trainerlist = await Users.find({ statusid: 1, _id: req.body.id }).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                //resObj.noOfPage = CalcPagesCount(trainerlist.length,limitValue);
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        else {
            const trainerlist = await Users.find({ statusid: 1, availablestatus: req.body.availablestatus }).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
            if (trainerlist) {
                resObj.trainerlist = trainerlist;
                //resObj.noOfPage = CalcPagesCount(trainerlist.length,limitValue);
                return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
            }
        }
        return res.status(200).json({ status: 2, message: "Trainer not found." });
    }
    catch (err) {
        errorLog("trainerlist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const clientlist = async (req, res) => {
    try {
        //console.log('Controller');
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get clients." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "firstname";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        var resObj = {
            memberlist: [],
            noOfRecords: await Client.estimatedDocumentCount()
        }
        const clientlist = await Client.find({ status: 1 }).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
        if (clientlist) {
            resObj.memberlist = clientlist;
            return res.status(200).json({ status: 1, message: "Get successfully.", result: resObj });
        }
        return res.status(200).json({ status: 2, message: "client not found.", result: [] });
    }
    catch (err) {
        errorLog("clientlist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const savenotification = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });
        const planInput = {
            date: req.body.date,
            title: req.body.title,
            description: req.body.description,
            sentby: req.body.sentby,
            sentto: req.body.sentto
        };
        const notificationslist = new Notifications(planInput);
        await notificationslist.save()
            .then((data) => {
                res.status(200).json({ status: 1, message: "Notification insert successfully.", result: notificationslist });
            })
            .catch(function (error) {
                res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
            });

    }
    catch (err) {
        errorLog("savenotification", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const notificationlist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "date";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;
        console.log(sortObject)

        var resultObj = {
            list: [],
            count: 0
        }
        const clientlst = await Notifications.aggregate([
            { "$addFields": { "cId": { "$toObjectId": "$sentto" } } },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" },
            { $sort: sortObject },
        ]);
        const trainerlst = await Notifications.aggregate([
            { "$addFields": { "tId": { "$toObjectId": "$sentto" } } },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" },
            { $sort: sortObject },
        ]);
        var lst = clientlst.concat(trainerlst);
        resultObj.list = lst.slice(((pageNumber - 1) * limitValue), (((pageNumber - 1) * limitValue) + limitValue));
        resultObj.count = lst.length || 0;
        console.log(resultObj)
        if (lst) {
            return res.status(200).json({ status: 1, message: "Get notification successfully.", result: resultObj });
        }
        // if (req.user.role == "client") {
        //     const senderlist = await Notifications.aggregate([
        //         { $match: { sentby: req.user._id } },
        //         { $sort: sortObject },
        //         { "$addFields": { "cId": { "$toObjectId": "$sentby" }, "tId": { "$toObjectId": "$sentto" } } },
        //         {
        //             $lookup: {
        //                 from: "clientusers",
        //                 localField: "cId",
        //                 foreignField: "_id",
        //                 as: "client_data"
        //             }
        //         },
        //         { $unwind: "$client_data" },
        //         {
        //             $lookup: {
        //                 from: "trainerusers",
        //                 localField: "tId",
        //                 foreignField: "_id",
        //                 as: "trainer_data"
        //             }
        //         },
        //         { $unwind: "$trainer_data" }
        //     ]);
        //     const receiverlist = await Notifications.aggregate([
        //         { $match: { sentto: req.user._id } },
        //         { $sort: sortObject },
        //         { "$addFields": { "cId": { "$toObjectId": "$sentto" }, "tId": { "$toObjectId": "$sentby" } } },
        //         {
        //             $lookup: {
        //                 from: "clientusers",
        //                 localField: "cId",
        //                 foreignField: "_id",
        //                 as: "client_data"
        //             }
        //         },
        //         { $unwind: "$client_data" },
        //         {
        //             $lookup: {
        //                 from: "trainerusers",
        //                 localField: "tId",
        //                 foreignField: "_id",
        //                 as: "trainer_data"
        //             }
        //         },
        //         { $unwind: "$trainer_data" }
        //     ]);
        //     var lst = senderlist.concat(receiverlist);
        //     resultObj.list = lst.slice(((pageNumber - 1) * limitValue), (((pageNumber - 1) * limitValue) + limitValue));
        //     resultObj.count = lst.length || 0;
        //     console.log(resultObj)
        //     if (resultObj) {
        //         return res.status(200).json({ status: 1, message: "Get Video sessions list successfully.", result: resultObj });
        //     }
        // }
        // else {
        //     const senderlist = await Notifications.aggregate([
        //         { $match: { sentby: req.user._id } },
        //         { "$addFields": { "cId": { "$toObjectId": "$sentto" }, "tId": { "$toObjectId": "$sentby" } } },
        //         {
        //             $lookup: {
        //                 from: "clientusers",
        //                 localField: "cId",
        //                 foreignField: "_id",
        //                 as: "client_data"
        //             }
        //         },
        //         { $unwind: "$client_data" },
        //         {
        //             $lookup: {
        //                 from: "trainerusers",
        //                 localField: "tId",
        //                 foreignField: "_id",
        //                 as: "trainer_data"
        //             }
        //         },
        //         { $unwind: "$trainer_data" }
        //     ]);
        //     const receiverlist = await Notifications.aggregate([
        //         { $match: { sentto: req.user._id } },
        //         { "$addFields": { "cId": { "$toObjectId": "$sentby" }, "tId": { "$toObjectId": "$sentto" } } },
        //         {
        //             $lookup: {
        //                 from: "clientusers",
        //                 localField: "cId",
        //                 foreignField: "_id",
        //                 as: "client_data"
        //             }
        //         },
        //         { $unwind: "$client_data" },
        //         {
        //             $lookup: {
        //                 from: "trainerusers",
        //                 localField: "tId",
        //                 foreignField: "_id",
        //                 as: "trainer_data"
        //             }
        //         },
        //         { $unwind: "$trainer_data" }
        //     ]);
        //     var lst = senderlist.concat(receiverlist);
        //     resultObj.list = lst.slice(((pageNumber - 1) * limitValue), (((pageNumber - 1) * limitValue) + limitValue));
        //     resultObj.count = lst.length || 0;
        //     console.log(resultObj)
        //     if (resultObj) {
        //         return res.status(200).json({ status: 1, message: "Get Video sessions list successfully.", result: resultObj });
        //     }
        // }
    }
    catch (err) {
        console.log(err)
        errorLog("notificationlist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
}
const savesetting = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const equplist = await Setting.findOne({ _id: mongoose.Types.ObjectId(req.body.id) });
        if (equplist) {
            equplist.val = req.body.val;
            equplist.save();
            return res.status(200).json({ status: 1, message: "Equipment update successfully.", result: equplist });
        } else {
            const planInput = {
                date: req.body.date,
                code: req.body.code,
                key: req.body.key,
                val: req.body.val
            };
            const settinglist = new Setting(planInput);
            await settinglist.save()
                .then((data) => {
                    res.status(200).json({ status: 1, message: "Setting insert successfully.", result: settinglist });
                })
                .catch(function (error) {
                    res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
                });
        }



    }
    catch (err) {
        errorLog("savesetting", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const getSettingbycode = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const settinglist = await Setting.findOne({ code: req.body.code });
        if (settinglist) {
            return res.status(200).json({ status: 1, message: "Get Setting by code successfully.", result: settinglist });
        }
        return res.status(200).json({ status: 2, message: "Setting not found.", result: resObj });
    }
    catch (err) {
        errorLog("getSettingbycode", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const settinglist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        var resObj = {
            settinglist: [],
            noOfRecords: await Setting.estimatedDocumentCount()
        }
        const settinglist = await Setting.find({}).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
        if (settinglist) {
            resObj.settinglist = settinglist;
            return res.status(200).json({ status: 1, message: "Get Setting successfully.", result: resObj });
        }
        return res.status(200).json({ status: 2, message: "Setting not found.", result: resObj });
    }
    catch (err) {
        errorLog("settinglist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const trainerBookinglist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        const trainerlist = await ScheduleRequestSchema.aggregate([
            { "$addFields": { "cId": { "$toObjectId": "$userid" }, "tId": { "$toObjectId": "$trainerid" } } },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "client_data"
                }
            },
            { $unwind: "$client_data" },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
            { $sort: sortObject },
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
        //console.log(trainerlist)
        if (trainerlist) {
            return res.status(200).json({ status: 1, message: "Get trainer booking list successfully.", result: trainerlist });
        }
        return res.status(200).json({ status: 1, message: "Get trainer booking list successfully.", result: trainerlist });
    }
    catch (err) {
        console.log(err)
        errorLog("trainerBookinglist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
}

const clientBookinglist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        const clientlist = await ScheduleRequestSchema.aggregate([
            { "$addFields": { "cId": { "$toObjectId": "$userid" }, "tId": { "$toObjectId": "$trainerid" } } },
            {
                $lookup: {
                    from: "clientusers",
                    localField: "cId",
                    foreignField: "_id",
                    as: "client_data"
                }
            },
            { $unwind: "$client_data" },
            {
                $lookup: {
                    from: "trainerusers",
                    localField: "tId",
                    foreignField: "_id",
                    as: "trainer_data"
                }
            },
            { $unwind: "$trainer_data" },
            { $sort: sortObject },
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

        if (clientlist) {
            return res.status(200).json({ status: 1, message: "Get client booking list successfully.", result: clientlist });
        }
        return res.status(200).json({ status: 1, message: "Get client booking list successfully.", result: clientlist });
    }
    catch (err) {
        errorLog("clientBookinglist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
}

const getmovement = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        var resObj = {
            movement: [],
            noOfRecords: await Movement.estimatedDocumentCount({ active: true })
        }
        const movementlist = await Movement.find({ active: true }).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
        if (movementlist) {
            resObj.movement = movementlist;
            return res.status(200).json({ status: 1, message: "Get Movement Categorysuccessfully.", result: resObj });
        }
        return res.status(200).json({ status: 2, message: "Movement Category not found.", result: resObj });
    }
    catch (err) {
        errorLog("getmovement", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getmovementlist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const movementlist = await Movement.find({ active: true }).sort({ _id: 1});
        if (movementlist) {
            return res.status(200).json({ status: 1, message: "Get Movement Categorysuccessfully.", result: movementlist });
        }
        return res.status(200).json({ status: 2, message: "Movement Category not found." });
    }
    catch (err) {
        errorLog("getmovementlist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const savemovement = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const movementlist = await Movement.findById({ _id: mongoose.Types.ObjectId(req.body.id) });
        if (movementlist) {
            movementlist.name = req.body.name;
            movementlist.value = req.body.value;
            movementlist.save();
            return res.status(200).json({ status: 1, message: "Movement update successfully." });
        } else {
            const movementInput = {
                name: req.body.name,
                value: req.body.value
            };
            const movement = new Movement(movementInput);
            await movement.save()
                .then((data) => {
                    res.status(200).json({ status: 1, message: "Movement insert successfully.", result: data });
                })
                .catch(function (error) {
                    res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
                });
        }
    }
    catch (err) {
        errorLog("savemovement", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const deletemovement = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const movementlist = await Movement.findById({ _id: req.body.id });
        if (movementlist) {
            movementlist.deleteOne({ _id: req.body.id });
            return res.status(200).json({ status: 1, message: "Movement delete successfully." });
        }
        return res.status(200).json({ status: 2, message: "Movement not found.", result: [] });
    }
    catch (err) {
        errorLog("deletemovement", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getcountry = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const limitValue = req.body.limitValue || 10;
        const pageNumber = req.body.pageNumber || 1;

        var sortObject = {};
        var sCol = req.body.sortedCol || "_id";
        var sOrd = req.body.sortedOrder || 1;
        sortObject[sCol] = sOrd;

        var resObj = {
            country: [],
            noOfRecords: await Country.estimatedDocumentCount({ active: true })
        }
        const countrylist = await Country.find({ statusid: 1 }).sort(sortObject).skip((pageNumber - 1) * limitValue).limit(limitValue);
        if (countrylist) {
            resObj.country = countrylist;
            return res.status(200).json({ status: 1, message: "Get Country Categorysuccessfully.", result: resObj });
        }
        return res.status(200).json({ status: 2, message: "Country Category not found.", result: resObj });
    }
    catch (err) {
        errorLog("getcountry", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const getcountrylist = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const countrylist = await Country.find({ statusid: 1 }).sort({ _id: 1});
        if (countrylist) {
            return res.status(200).json({ status: 1, message: "Get Country Categorysuccessfully.", result: countrylist });
        }
        return res.status(200).json({ status: 2, message: "Country Category not found." });
    }
    catch (err) {
        errorLog("getcountrylist", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const savecountry = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const countrylist = await Country.findById({ _id: mongoose.Types.ObjectId(req.body.id) });
        if (countrylist) {
            countrylist.name = req.body.name;
            countrylist.shortname = req.body.shortname;
            countrylist.code = req.body.code;
            countrylist.mask = req.body.mask;
            countrylist.statusid = req.body.statusid;
            countrylist.save();
            return res.status(200).json({ status: 1, message: "Country update successfully." });
        } else {
            const countryInput = {
                name: req.body.name,
                shortname: req.body.shortname,
                code: req.body.code,
                mask: req.body.mask,
                statusid: req.body.statusid
            };
            const country = new Country(countryInput);
            await country.save()
                .then((data) => {
                    res.status(200).json({ status: 1, message: "Country insert successfully.", result: data });
                })
                .catch(function (error) {
                    res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
                });
        }
    }
    catch (err) {
        errorLog("savecountry", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const deletecountry = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get admin." });

        const countrylist = await Country.findById({ _id: req.body.id });
        if (countrylist) {
            countrylist.deleteOne({ _id: req.body.id });
            return res.status(200).json({ status: 1, message: "Country delete successfully." });
        }
        return res.status(200).json({ status: 2, message: "Country not found.", result: [] });
    }
    catch (err) {
        errorLog("deletecountry", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

module.exports = {
    getworkoutcategory,
    saveworkoutcategory,
    deleteworkoutcategory,
    getstaff,
    savestaff,
    deletestaff,
    getgoalstypes,
    savegoalstypes,
    deletegoalstypes,
    getequipments,
    saveequipments,
    deleteequipments,
    getplan,
    saveplan,
    deleteplan,
    ratinglist,
    deleterating,
    workoutlist,
    trainerlist,
    clientlist,
    savenotification,
    notificationlist,
    savesetting,
    getSettingbycode,
    settinglist,
    trainerBookinglist,
    clientBookinglist,
    getmovement,
    getmovementlist,
    savemovement,
    deletemovement,
    getcountry,
    getcountrylist,
    savecountry,
    deletecountry
};