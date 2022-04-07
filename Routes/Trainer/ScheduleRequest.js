const express = require("express");
const ScheduleRequestRoute = express.Router();

const ScheduleRequestController = require("../../Controller/Trainer/ScheduleRequestController");

const JWTAuth = require("../../Middleware/JWTAuth");

ScheduleRequestRoute.post("/schedulerequestupdate", JWTAuth, ScheduleRequestController.ScheduleRequestUpdate);
ScheduleRequestRoute.post("/sessionactivestatusupdate", JWTAuth, ScheduleRequestController.SessionActiveStatusUpdate);
ScheduleRequestRoute.get("/getsessionrequest", JWTAuth, ScheduleRequestController.getSessionRequest);
ScheduleRequestRoute.post("/workout", JWTAuth, ScheduleRequestController.workout);
ScheduleRequestRoute.post("/getPendingRequest", JWTAuth, ScheduleRequestController.getPendingRequest);
ScheduleRequestRoute.post("/getAcceptRequest", JWTAuth, ScheduleRequestController.getAcceptRequest);

module.exports = ScheduleRequestRoute;