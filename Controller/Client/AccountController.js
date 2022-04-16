const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const Cryptr = require("cryptr");
const path = require("path");
const mongoose = require('mongoose');
const Users = require("../../Model/Client/UserSchema");
const { SendMailHtml } = require("../EmailController");
const { errorLog } = require("../Errorcontroller");

const JWTSECRET = process.env.JWTSECRET;
const ENCRYPTSECRET = process.env.ENCRYPTSECRET;
const WEBRESETPASSWORDHOST = process.env.WEBRESETPASSWORDHOST;

const cryptr = new Cryptr(ENCRYPTSECRET);

const register = async (req, res) => {
    try {
        if (req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Logged in user cannot register new users." });

        const userexists = await Users.findOne({ email: req.body.email }).collation({ locale: 'en', strength: 2 });
        if (userexists)
            return res.status(200).json({ status: 2, message: "email already exists." });

        var filename = "";
        if (req.files) {
            const file = req.files.profile;
            const extensionName = path.extname(file.name); // fetch the file extension
            const allowedExtension = ['.png', '.jpg', '.jpeg'];

            if (!allowedExtension.includes(extensionName))
                return res.status(200).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

            if (file.size > (1024 * 1024 * 1))
                return res.status(200).json({ status: 2, message: "File size is more than 1 MB." });

            filename = "/public/clientprofile/" + `profile_${Date.now()}${extensionName}`;

            await file.mv("." + filename);
        } else {
            filename = req.body.profile;
        }

        const salt = await bcrypt.genSalt(3);
        const hashpassword = await bcrypt.hash(req.body.password, salt);

        //Store in MongoDB
        const userInput = {
            profile: filename,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashpassword,
            phoneno: req.body.phoneno,
            age: req.body.age,
            gender: req.body.gender,
            heightisfeet: req.body.heightisfeet,
            height: req.body.height,
            weightiskg: req.body.weightiskg,
            weight: req.body.weight,
            equipmentavailable: req.body.equipmentavailable,
            fitnessgoals: req.body.fitnessgoals,
            otherfitnessgoals: req.body.otherfitnessgoals,
            injuriesorhelthissues: req.body.injuriesorhelthissues,
            emailnotifications: req.body.emailnotifications,
            maillinglist: req.body.maillinglist,
            textnotifications: req.body.textnotifications,
            webnotifications: req.body.webnotifications,
            mobilenotifications: req.body.mobilenotifications,
            standersession: 0,
            elitesession: 0,
            statusid: 1
        };
        const user = new Users(userInput);

        await user.save()
            .then((data) => {

                // Mail code.
                fs.readFile("./EmailTemplate/MemberSignup.html", async (error, data) => {
                    if (error)
                        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });

                    const emailbody = data.toString().replace("##Name##", userInput.firstname);

                    var emaildata = { "to": userInput.email, "subject": "Member Registration", "html": emailbody };

                    let emailresult = await SendMailHtml(emaildata);
                    return res.status(200).json({ status: 1, message: "Member Registration successfully email sent.", result: data });
                    // if (emailresult === true)
                    //     return res.status(200).json({ status: 1, message: "Member Registration successfully email sent.", result: data });
                    // else
                    //     return res.status(200).json({ status: 2, message: "Something getting wrong." });
                });

                //return res.status(200).json({ status: 1, message: "Registration successfully.", result: data });
            })
            .catch(function (error) {
                errorLog("register", req.body, error);
                return res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString(), result: {} });
            });
    }
    catch (err) {
        errorLog("register", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const verifyemailexists = async (req, res) => {
    try {
        if (req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Logout to check." });

        if (!req.body.email)
            return res.status(200).json({ status: 2, message: "Please enter email." });

        const userexists = await Users.findOne({ email: req.body.email }).collation({ locale: 'en', strength: 2 });
        if (userexists) {
            return res.status(200).json({ status: 2, message: "Email already exists." });
        }
        return res.status(200).json({ status: 1, message: "Success." });
    }
    catch (err) {
        errorLog("verifyemailexists", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const login = async (req, res) => {
    try {
        if (req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Logged in user cannot login again." });

        const userexists = await Users.findOne({ email: req.body.email }).collation({ locale: 'en', strength: 2 });
        if (userexists) {
            if (userexists.statusid != 1)
                return res.status(200).json({ status: 2, message: "User not activated." });

            const passwordverify = await bcrypt.compare(req.body.password, userexists.password);
            if (!passwordverify)
                return res.status(200).json({ status: 2, message: "Incorrect password." });
            const token = await JWT.sign({ _id: userexists._id, isAuthenticated: true, role: "client" }, JWTSECRET, {})
            // .then((data) => {
            //     res.status(200).json({ status: 1, message: "Registration successfully.", result: data });
            // })
            // .catch(function (error) {
            //     res.status(200).json({ status: 2, message: "Something getting wrong.", error: error, result: {} });
            // });
            res.cookie("access_token", token);

            return res.status(200).json({
                status: 1, message: "Login successfully.",
                result: { "User": userexists, "token": token }
            });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("login", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getprofile = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const userexists = await Users.findById({ _id: req.user._id });
        if (userexists) {
            return res.status(200).json({ status: 1, message: "Get successfully.", result: userexists });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("getprofile", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getprofilebyid = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const userexists = await Users.findById({ _id: req.body.id });
        if (userexists) {
            return res.status(200).json({ status: 1, message: "Get successfully.", result: userexists });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("getprofilebyid", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const updateprofile = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to update profile." });

        const userexists = await Users.findOne({ _id: { $ne: req.user._id }, email: req.body.email }).collation({ locale: 'en', strength: 2 });
        if (userexists)
            return res.status(200).json({ status: 2, message: "email already register with another user." });

        const usernotactive = await Users.findById({ _id: req.user._id });
        if (usernotactive.statusid != 1)
            return res.status(200).json({ status: 2, message: "User not activated." });

        var filename = req.body.edprofile || "";
        if (req.files) {
            // Profile Image Upload & Update
            const file = req.files.profile;
            if (file) {
                const extensionName = path.extname(file.name); // fetch the file extension
                const allowedExtension = ['.png', '.jpg', '.jpeg'];

                if (!allowedExtension.includes(extensionName))
                    return res.status(422).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

                if (file.size > (1024 * 1024 * 1))
                    return res.status(422).json({ status: 2, message: "File size is more than 1 MB." });

                filename = "/public/profile/" + `profile_${Date.now()}${extensionName}`;

                await file.mv("." + filename);
            }
        }

        const salt = await bcrypt.genSalt(3);
        if (req.body.oldpassword != "" && req.body.password != "" && req.body.confirmpassword != "") {
            const passwordverify = await bcrypt.compare(req.body.oldpassword, usernotactive.password);
            if (!passwordverify)
                return res.status(200).json({ status: 2, message: "Old password does not same as password." });
            if (req.body.password != req.body.confirmpassword)
                return res.status(200).json({ status: 2, message: "Password and confirm password should be same." });
        }


        const userdata = await Users.findOne({ _id: req.user._id });
        if (userdata) {
            userdata.profile = filename;
            userdata.firstname = req.body.firstname;
            userdata.lastname = req.body.lastname;
            userdata.email = req.body.email;
            userdata.phoneno = req.body.phoneno;
            userdata.age = req.body.age;
            userdata.gender = req.body.gender;
            userdata.heightisfeet = req.body.heightisfeet;
            userdata.height = req.body.height;
            userdata.weightiskg = req.body.weightiskg;
            userdata.weight = req.body.weight;
            userdata.equipmentavailable = req.body.equipmentavailable;
            userdata.fitnessgoals = req.body.fitnessgoals;
            userdata.otherfitnessgoals = req.body.otherfitnessgoals;
            userdata.injuriesorhelthissues = req.body.injuriesorhelthissues;
            userdata.emailnotifications = req.body.emailnotifications;
            userdata.maillinglist = req.body.maillinglist;
            userdata.textnotifications = req.body.textnotifications;
            userdata.webnotifications = req.body.webnotifications;
            userdata.mobilenotifications = req.body.mobilenotifications;
            userdata.progressphotos = req.body.progressphotos;
            if (req.body.oldpassword != "" && req.body.password != "" && req.body.confirmpassword != "") {
                const hashNewpassword = await bcrypt.hash(req.body.password, salt);
                userdata.password = hashNewpassword;
            }
            userdata.save();

            return res.status(200).json({ status: 1, message: "updated successfully." });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("updateprofile", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const updateNotification = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const updateNotificationInput = await Users.findOne({ _id: mongoose.Types.ObjectId(req.user._id) });
        if (updateNotificationInput) {
            updateNotificationInput.notification = req.body.notification;
            updateNotificationInput.save();

            // const userdata = await Users.findOne({ _id: mongoose.Types.ObjectId(scheduleRequestInput.userid) });
            // const trainerdata = await Trainers.findOne({ _id: mongoose.Types.ObjectId(scheduleRequestInput.trainerid) });
            // // Client SMS Code
            // if (req.body.status != 1) {
            //     let msg = userdata.firstname + " your session request is reject by " + trainerdata.firstname + "."
            //     var jsonData = {
            //         date: new Date(),
            //         title: "Reject session request",
            //         description: msg,
            //         type: req.user,
            //         sentby: req.user._id || "-",
            //         sentto: userdata._id || "-",
            //     };
            //     var obj = {
            //         number: userdata.phoneno,
            //         body: (msg || ""),
            //         data: jsonData
            //     }
            //     let smsresult = SendTextMessage(obj);
            // }
            var notif = updateNotificationInput.notification
            // var notif = {};
            // const updateNotification = await Users.findOne({ _id: mongoose.Types.ObjectId(req.user._id) });
            // if (updateNotification) {
            //      notif = (updateNotification.notification == undefined || updateNotification.notification == null) ? {} : updateNotification.notification;
            // }
            return res.status(200).json({ status: 1, message: "Update notification  successfully.", result: notif });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        console.log(err)
        errorLog("updateNotification", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getNotification = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        const updateNotificationInput = await Users.findOne({ _id: mongoose.Types.ObjectId(req.user._id) });
        if (updateNotificationInput) {
            const notif = (updateNotificationInput.notification == undefined || updateNotificationInput.notification == null) ? {} : updateNotificationInput.notification;
            return res.status(200).json({ status: 1, message: "get notification  successfully.", result: notif });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("getNotification", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const forgotpassword = async (req, res) => {
    try {
        if (req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Logged in user cannot forgot password." });

        const userexists = await Users.findOne({ email: req.body.email }).collation({ locale: 'en', strength: 2 });
        if (userexists) {
            fs.readFile("./EmailTemplate/ForgotPassword.html", async (error, data) => {
                if (error)
                    return res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });

                let encryptedstr = cryptr.encrypt(Date.now().toString() + ":" + userexists.email);
                var resetpasswordUrl = WEBRESETPASSWORDHOST + "client/account/resetpassword/" + encryptedstr;

                const emailbody = data.toString().replace("##ResetPasswordLink##", resetpasswordUrl);

                var emaildata = { "to": userexists.email, "subject": "Reset Password", "html": emailbody };

                let emailresult = await SendMailHtml(emaildata);
                if (emailresult === true)
                    return res.status(200).json({ status: 1, message: "Reset password link sent to your registred email." });
                else
                    return res.status(200).json({ status: 2, message: "Something getting wrong." });
            });
        }
        else
            return res.status(200).json({ status: 2, message: "Email not registered." });
    }
    catch (err) {
        errorLog("forgotpassword", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const resetpassword = async (req, res) => {
    try {
        const encryptedstr = req.params.encryptedstr;
        if (!encryptedstr)
            return res.status(200).json({ status: 2, message: "Not found." });

        let decryptedstr = cryptr.decrypt(encryptedstr);
        let paramlist = decryptedstr.split(":");
        let datetime = paramlist[0];
        let email = paramlist[1];

        if (((parseInt(Date.now()) - parseInt(datetime)) / (1000 * 60)) > 30)
            return res.status(200).json({ status: 2, message: "Reset paaword link expire." });

        const userexists = await Users.findOne({ email: email }).collation({ locale: 'en', strength: 2 });
        if (userexists) {
            const salt = await bcrypt.genSalt(3);
            const hashpassword = await bcrypt.hash(req.body.password, salt);
            userexists.password = hashpassword;
            userexists.save();

            return res.status(200).json({ status: 1, message: "Password updated successfully." });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("resetpassword", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const saveprogressphotos = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        //var progressphotosObj = JSON.parse(req.body.progressphotos)
        var nooffiles = JSON.parse(req.body.filelist) || [];
        var filist = [];
        var imgllist = [];
        console.log(req.body.filelist)
        console.log(req.files)
        if (req.files) {
            console.log("Inner File")
            nooffiles.forEach(element => {
                var qfilename = "";
                console.log(element)
                console.log(req.files[element])
                const file = req.files[element];
                console.log(file.name)
                const extensionName = path.extname(file.name); // fetch the file extension
                const allowedExtension = ['.png', '.jpg', '.jpeg'];

                if (!allowedExtension.includes(extensionName))
                    return res.status(422).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

                if (file.size > (1024 * 1024 * 1))
                    return res.status(422).json({ status: 2, message: "File size is more than 1 MB." });

                qfilename = "/public/clientprogressphoto/" + `progress_${Date.now()}${extensionName}`;

                file.mv("." + qfilename);
                filist.push(qfilename);
            });
            imgllist.push({
                "date": req.body.progressphotos,
                "list": filist
            })
        }
        console.log(imgllist)
        const userdata = await Users.findOne({ _id: req.user._id });
        if (userdata) {
            userdata.progressphotos = imgllist;
            userdata.save();
            return res.status(200).json({ status: 1, message: "Progress photos save successfully." });
        }
        return res.status(200).json({ status: 2, message: "Request not found." });
    }
    catch (err) {
        errorLog("saveprogressphotos", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
const getprogressphotos = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const userdata = await Users.findOne({ _id: req.user._id });
        if (userdata) {
            return res.status(200).json({ status: 1, message: "Get successfully.", result: (userdata.progressphotos || []) });
        }
        return res.status(200).json({ status: 1, message: "Get successfully." });
    }
    catch (err) {
        errorLog("getprogressphotos", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
module.exports = {
    register,
    verifyemailexists,
    login,
    getprofile,
    getprofilebyid,
    updateprofile,
    getNotification,
    updateNotification,
    forgotpassword,
    resetpassword,
    getprogressphotos,
    saveprogressphotos
};