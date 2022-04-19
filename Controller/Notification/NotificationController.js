const { pushNotification } = require("../PushNotificationController");
const { errorLog } = require("../Errorcontroller");

const pushnotify = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "User not logged." });

        var obj = {
            registrationToken: req.body.registrationToken,
            date: new Date(),
            title: req.body.title,
            message: req.body.message,
            type: req.body.type,
            userid: req.body.userid,
            resid: ""
        }
        let notifyresult = pushNotification(obj);
        if (notifyresult)
            return res.status(200).json({ status: 1, message: "Notification successfully sent." });

        return res.status(200).json({ status: 2, message: "Notification fail." });
    }
    catch (err) {
        errorLog("pushnotify", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};
module.exports = { pushnotify };