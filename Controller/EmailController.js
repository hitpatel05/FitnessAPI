const nodemailer = require("nodemailer");

async function SendMailHtml(data) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "fitnessmgmt22@gmail.com",
                pass: "Fitness2022",
            }
        });

        var mailOptions = {
            from: "fitnessmgmt22@gmail.com", // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            html: data.html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            }
            else
                resolve(true);
        });
    });
}

async function SendMailText(data) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "knktfitness@gmail.com",
                pass: "KNKT1234",
            }
        });

        var mailOptions = {
            from: "knktfitness@gmail.com", // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            text: data.text
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            }
            else
                resolve(true);
        });
    });
}

module.exports = {
    SendMailText,
    SendMailHtml
};