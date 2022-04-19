const Users = require("../../Model/Client/UserSchema");
const Trainers = require("../../Model/Trainer/UserSchema");
const BlockInfoTrainerSchema = require("../../Model/Trainer/BlockInfoTrainerSchema");
const BlockInfoClientSchema = require("../../Model/Client/BlockInfoClientSchema");
const mongoose = require('mongoose');
const fs = require("fs");
const { SendMailHtml } = require("../EmailController");
const { SendTextMessage } = require("../SMSController");
const { errorLog } = require("../Errorcontroller");

const deleteclient = async (req, res) => {
    if (!req.user.isAuthenticated)
        return res.status(200).json({ status: 2, message: "Please login to get clients." });
    await Users.findOne({ "_id": req.body._id }).then((userdata) => {
        Users.deleteOne({ "_id": req.body._id }).then((deleteddata) => {
            if (deleteddata.deletedCount === 1) {
                return res.json({ status: 1, message: "Client deleted successfully.", result: {} });
            }
        }).catch(function (error) {
            errorLog("deleteclient", req.body, error);
            return res.json({ status: 2, message: error, result: {} });
        });
    }).catch(function (err) {
        errorLog("deleteclient", req.body, err);
        return res.json({ status: 2, message: err, result: {} });
    });
};

const client = async (req, res) => {
    try {
        //console.log('Controller');
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get clients." });
        if (req.body.availablestatus === 0) {
            //const clientlist = await Users.findOne({ status: 1 });
            //const clientlist = await Users.find({ status: 1 });
            const clientlist = await Users.find({ status: 1 });
            if (clientlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: clientlist });
        }
        else {
            //const clientlist = await Users.findOne({ status: 1, availablestatus: req.body.availablestatus });
            const clientlist = await Users.find({ status: 1, availablestatus: req.body.availablestatus });
            if (clientlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: clientlist });
        }
        return res.status(200).json({ status: 2, message: "client not found.", result: [] });
    }
    catch (err) {
        errorLog("client", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const clientdetails = async (req, res) => {
    //console.log(req.body);
    try {
        //console.log(req);
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get client." });
        if (req.body.availablestatus === 0) {
            //const clientlist = await Users.findOne({ status: 1 });
            //const clientlist = await Users.find({ status: 1 });
            const clientlist = await Users.find({ status: 1 });
            if (clientlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: clientlist });
        }
        else if (req.body.userId !== "") {
            const clientlist = await Users.findById({ _id: req.body.userId });
            if (clientlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: clientlist });
        }
        else {
            //const clientlist = await Users.findOne({ status: 1, availablestatus: req.body.availablestatus });
            const clientlist = await Users.find({ status: 1, availablestatus: req.body.availablestatus });
            if (clientlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: clientlist });
        }
        return res.status(200).json({ status: 2, message: "client not found.", result: [] });
    }
    catch (err) {
        errorLog("clientdetails", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const saveclient = async (req, res) => {
    console.log(req.body);
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to update clients." });
        //var user = new Users(req.body);
        //const filter = { _id: req.body._id };
        // this option instructs the method to create a document if no documents match the filter
        //const options = { upsert: true };
        //const status = await Users.findByIdAndUpdate(req.body._id,user);
        // console.log(status);
        const userdata = await Users.findOne({ _id: req.body._id });
        if (userdata) {
            userdata.firstname = req.body.firstname;
            userdata.lastname = req.body.lastname;
            //userdata.email = req.body.email;
            //userdata.phoneno = req.body.phoneno;
            userdata.age = req.body.age;
            userdata.gender = req.body.gender;
            userdata.statusid = req.body.isactive;
            userdata.save();
        }
        return res.status(200).json({ status: 1, message: "Updated successfully." });
    }
    catch (err) {
        errorLog("saveclient", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const searchclient = async (req, res) => {
    try {
        //console.log('Controller');
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get clients." });
        if (req.body.searchname !== "") {

            let searchtext = "/.*" + req.body.searchname + ".*/";
            //console.log(searchtext);
            const regExp = new RegExp(eval(searchtext), "i")
            //console.log(regExp);
            const clientlist = await Users.find({ $or: [{ firstname: regExp }, { lastname: regExp }, { email: regExp }, { phoneno: regExp }] });
            if (clientlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: clientlist });
        }
        else if (req.body.availablestatus === 0) {
            //const clientlist = await Users.findOne({ status: 1 });
            //const clientlist = await Users.find({ status: 1 });
            const clientlist = await Users.find({ status: 1 });
            if (clientlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: clientlist });
        }
        else {
            //const clientlist = await Users.findOne({ status: 1, availablestatus: req.body.availablestatus });
            const clientlist = await Users.find({ status: 1, availablestatus: req.body.availablestatus });
            if (clientlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: clientlist });
        }
        return res.status(200).json({ status: 2, message: "client not found.", result: [] });
    }
    catch (err) {
        errorLog("searchclient", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getclient = async (req, res) => {
    //console.log(req.body);
    try {
        //console.log(req);
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get client." });
        const clientlist = await Users.findById({ _id: req.user._id });
        if (clientlist)
            return res.status(200).json({ status: 1, message: "Get successfully.", result: clientlist });
        return res.status(200).json({ status: 2, message: "client not found.", result: [] });
    }
    catch (err) {
        errorLog("getclient", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const bookmarktrainer = async (req, res) => {
    console.log(req.body);
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to update clients." });

        const userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(req.user._id) });
        if (userdata) {
            const bookmarktrainerList = userdata.bookmarktrainer || [];
            //console.log(bookmarktrainerList);
            const TrainersDB = await Trainers.findOne({ _id: mongoose.Types.ObjectId(req.body.tainerId) });
            console.log(bookmarktrainerList.findIndex(instance => instance === req.body.tainerId));
            var ind = bookmarktrainerList.findIndex(instance => instance === req.body.tainerId);
            if (ind > -1) {
                bookmarktrainerList.splice(ind, 1);
            } else {
                bookmarktrainerList.push(req.body.tainerId);
            }
            userdata.bookmarktrainer = bookmarktrainerList;
            userdata.save();

            if (ind == 0) {
                // Trainer Email Code
                fs.readFile("./EmailTemplate/Favourite.html", async (error, data) => {
                    if (error)
                        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });

                    const emailbody = data.toString()
                        .replace("##TrainerName##", TrainersDB.firstname || "Trainer")
                        .replace("##ClientName##", userdata.firstname || "Client")

                    var emaildata = { "to": TrainersDB.email, "subject": "Favourite trainer.", "html": emailbody };

                    let emailresult = await SendMailHtml(emaildata);
                    // if (emailresult === true)
                    //     return res.status(200).json({ status: 1, message: "Favourite trainer successfully." });
                    // else
                    //     return res.status(200).json({ status: 2, message: "Something getting wrong." });
                });

                // Client SMS Code
                let msg = userdata.firstname + " favourite to you."
                var jsonData = {
                    date: new Date(),
                    title: "Trainer favourite",
                    description: msg,
                    type: req.user,
                    sentby: req.user._id || "-",
                    sentto: TrainersDB._id || "-"
                };
                var obj = {
                    number: TrainersDB.phoneno,
                    body: (msg || ""),
                    data: jsonData

                }
                let smsresult = SendTextMessage(obj);
            }
            return res.status(200).json({ status: 1, message: (ind > -1) ? "Remove bookmark trainer successfully." : "Bookmark trainer successfully." });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("bookmarktrainer", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const blockreporttrainer = async (req, res) => {
    console.log(req.body);
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to update clients." });

        // const blockInfodata = await BlockInfoTrainerSchema.findOne({ userid: req.user._id, trainerid: req.body.trainerid });
        // if (blockInfodata ==  null) {
        const blockInput = {
            userid: req.user._id,
            trainerid: req.body.trainerid,
            isBlock: req.body.isBlock, // 1 -Block & 2 -Report
            reason: req.body.reason
        };
        const blockInfo = new BlockInfoTrainerSchema(blockInput);
        console.log(blockInput);
        await blockInfo.save()
            .then((data) => {
                return res.status(200).json({ status: 1, message: ((req.body.isBlock == 1) ? "Trainer block successfully." : "Trainer report successfully."), result: data });
            })
            .catch(function (error) {
                errorLog("blockreporttrainer", req.body, error);
                return res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString(), result: {} });
            });
        // } else {

        // }
    }
    catch (err) {
        errorLog("blockreporttrainer", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const blockreportclient = async (req, res) => {
    console.log(req.body);
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to update trainer." });

        const blockInput = {
            userid: req.user._id,
            clientid: req.body.clientid,
            isBlock: req.body.isBlock, // 1 -Block & 2 -Report
            reason: req.body.reason
        };
        const blockInfo = new BlockInfoClientSchema(blockInput);
        console.log(blockInput);
        await blockInfo.save()
            .then((data) => {
                return res.status(200).json({ status: 1, message: ((req.body.isBlock == 1) ? "Client block successfully." : "Client report successfully."), result: data });
            })
            .catch(function (error) {
                errorLog("blockreportclient", req.body, error);
                return res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString(), result: {} });
            });
    }
    catch (err) {
        errorLog("blockreportclient", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
module.exports = { client, deleteclient, searchclient, saveclient, clientdetails, getclient, bookmarktrainer, blockreporttrainer, blockreportclient };