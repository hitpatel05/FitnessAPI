const UsersClient = require("../Model/Client/UserSchema");
const UsersTrainer = require("../Model/Trainer/UserSchema");
const UsersAdmin = require("../Model/Admin/UserSchema");
const { errorLog } = require("./Errorcontroller");

const VerifyToken = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        if (req.user.role === "client") {
            const userexists = await UsersClient.findOne({ _id: req.user._id, statusid: 1 });
            if (userexists)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: { User: userexists, role: "client" } });
        }
        else if (req.user.role === "trainer") {
            const userexists = await UsersTrainer.findOne({ _id: req.user._id, statusid: 1 });
            if (userexists)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: { User: userexists, role: "trainer" } });
        }
        else if (req.user.role === "admin") {
            const userexists = await UsersAdmin.findOne({ _id: req.user._id, statusid: 1 });
            if (userexists)
                return res.status(200).json({ status: 1, message: "Get successfully.", result: { User: userexists, role: "admin" } });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("VerifyToken", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err });
    }
};

module.exports = { VerifyToken };