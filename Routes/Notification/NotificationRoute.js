const express = require("express");
const NotificationRoute = express.Router();

const NotificationController = require("../../Controller/Notification/NotificationController");

const JWTAuth = require("../../Middleware/JWTAuth");

NotificationRoute.post("/pushnotify", JWTAuth, NotificationController.pushnotify);

module.exports = NotificationRoute;