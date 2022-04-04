const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const Cryptr = require("cryptr");
// const path = require("path");

const Users = require("../../Model/Admin/UserSchema");
const { SendMailHtml } = require("../EmailController");

const JWTSECRET = process.env.JWTSECRET;
const ENCRYPTSECRET = process.env.ENCRYPTSECRET;
const ADMINRESETPASSWORDHOST = process.env.ADMINRESETPASSWORDHOST;
const { errorLog } = require("../Errorcontroller");
const cryptr = new Cryptr(ENCRYPTSECRET);

const adminusers = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get trainer." });

        if (req.body.availablestatus === 0) {
            const adminlist = await Users.find({ status: 1 });
            if (adminlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: adminlist });
        }
        else {
            const adminlist = await Users.find({ status: 1, availablestatus: req.body.availablestatus });
            if (adminlist)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: adminlist });
        }
        return res.status(200).json({ status: 2, message: "Trainer not found.", result: [] });
    }
    catch (err) {
        errorLog("adminusers", req.body, err);
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
            const token = await JWT.sign({ _id: userexists._id, isAuthenticated: true, role: "admin" }, JWTSECRET, {})
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
                var resetpasswordUrl = ADMINRESETPASSWORDHOST + "client/account/resetpassword/" + encryptedstr;

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

module.exports = {
    login,
    forgotpassword,
    resetpassword,
    adminusers
};