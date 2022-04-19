var admin = require("firebase-admin");
var serviceAccount = require("./../db/serviceAccountKey.json");
const PushNotifications = require("./../Model/Notification/PushNotificationSchema");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function pushNotification(data) {
    return new Promise((resolve, reject) => {
        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
        const registrationToken = data.registrationToken
        const message = data.message
        const options = notification_options

        admin.messaging().sendToDevice(registrationToken, message, options)
            .then(response => {
                debugger
                data.resid = response.resid;
                new PushNotifications(data).save();
                //res.status(200).send("Notification sent successfully")
                console.log("Notification sent successfully");
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                resolve(false);
            });

    });
}

module.exports = {
    pushNotification
};