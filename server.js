const express = require('express');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });//dotenv to read configure file
const cookieParser = require("cookie-parser");
const cors = require('cors');
const fileupload = require('express-fileupload');
const AccountRoute = require("./Routes/AccountRoute");
const ClientAccountRoute = require("./Routes/Client/AccountRoute");
const TrainerAccountRoute = require("./Routes/Trainer/AccountRoute");
const ScheduleRequestRoute = require("./Routes/Trainer/ScheduleRequest");
const TrainerRoute = require("./Routes/Trainer/TrainerRoute");
const AccountInfoRoute = require("./Routes/Trainer/AccountInfoRoute");
const SessionRequestRoute = require("./Routes/Client/SessionRequestRoute");
const ClientListRoute = require("./Routes/Client/ClientRoute");
const PaymentRoute = require("./Routes/Payment/PaymentRoute");
const AdminAccountRoute = require("./Routes/Admin/AccountRoute");
const AdminRoute = require("./Routes/Admin/AdminRoute");
const VideoSessionRoute = require("./Routes/Meeting/VideoSessionRoute");
require("./db/dbconnection");//Mongo DB Connection

const app = express();
const PORT = process.env.PORT;

app.use(cors());
//app.options('*', cors());
//app.use(express.json());
app.use(express.json({ limit: "50mb" }));
//app.use(express.urlencoded({ extended: true }));//Convert req json to object
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 500000 }));//Convert req json to object

app.use(cookieParser());
app.use(fileupload());

app.use('/logs',express.static(__dirname + '/public/logs'));
app.use('/public/profile', express.static(__dirname + '/public/profile'));
app.use('/public/clientprofile', express.static(__dirname + '/public/clientprofile'));
app.use('/public/trainerprofile', express.static(__dirname + '/public/trainerprofile'));
app.use('/public/trainercover', express.static(__dirname + '/public/trainercover'));
app.use('/public/clientprogressphoto', express.static(__dirname + '/public/clientprogressphoto'));

// app.use(express.static('/public/profile'));

//Redirect to route
app.use("/account", AccountRoute);
app.use("/client/account", ClientAccountRoute);
app.use("/trainer/account", TrainerAccountRoute);
app.use("/trainer/session", ScheduleRequestRoute);
app.use("/trainer/trainer", TrainerRoute);
app.use("/trainer/accountinfo", AccountInfoRoute);
app.use("/client/session", SessionRequestRoute);
app.use("/client", ClientListRoute);
app.use("/payment", PaymentRoute);
app.use("/admin/account", AdminAccountRoute);
app.use("/admin", AdminRoute);
app.use("/meeting", VideoSessionRoute);
app.get("/public/profile/:path", (req, res) => {
    res.download(__dirname + "/public/profile/" + req.params.path);
});

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

//Handdle unexpected error
app.use(function (error, req, res, next) {
    return res.status(200).json({ status: 2, message: error.message });
});

app.all("*", (req, res) => {
    res.status(404).json({ status: 2, message: "Not found." });
});
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.listen(PORT, () => {
    console.log(`Server started at ${PORT} port.`);
});