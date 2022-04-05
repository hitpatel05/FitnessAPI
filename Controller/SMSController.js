const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const Notifications = require("./../Model/Admin/NotificationSchema");

async function SendTextMessage(data) {
    return new Promise((resolve, reject) => {
        client.messages
            .create({
                body: data.body,
                from: '+19035468255 ',
                to: data.number || ""
            })
            .then(message => {
                console.log("Id " + message.sid);
                new Notifications(data.data).save();
                resolve(true);
            })
            .catch(message => {
                console.log("Error " + message);
                resolve(false);
            });
        ////.then(message => console.log(message.sid));
        // data.numbersToMessage.forEach(function(number){
        //     client.messages.create({
        //       body:  data.body,
        //       from: '+911234567890',
        //       to: number
        //     })
        //     .then(message =>  {
        //         console.log(message.status);
        //         resolve(true); 
        //     })
        //     .catch(message =>  {
        //         console.log(message.status);
        //         reject(false); 
        //     })
        //     .done();
        //   });
    });
}

module.exports = {
    SendTextMessage
};
