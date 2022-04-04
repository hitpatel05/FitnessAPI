const express = require("express");
const SessionRequestRoute = express.Router();

const SessionRequestController = require("../../Controller/Client/SessionRequestController");

const JWTAuth = require("../../Middleware/JWTAuth");
const { SessionRequestValidator } = require("../../Middleware/Validation/Client/Validation");

SessionRequestRoute.post("/sessionrequest", JWTAuth, SessionRequestValidator, SessionRequestController.SessionRequest);
SessionRequestRoute.post("/getSessionByid", JWTAuth, SessionRequestController.getSessionByid);
SessionRequestRoute.post("/getworkout", JWTAuth, SessionRequestController.getworkout);
SessionRequestRoute.get("/getworkoutlist", JWTAuth, SessionRequestController.getworkoutlist);
SessionRequestRoute.post("/rating", JWTAuth, SessionRequestController.rating);
SessionRequestRoute.get("/getclientsession", JWTAuth, SessionRequestController.getClientSession);
SessionRequestRoute.post("/getupcommingsession", JWTAuth, SessionRequestController.getUpcommingSession);
SessionRequestRoute.post("/getcompeletedsession", JWTAuth, SessionRequestController.getCompeletedSession);

module.exports = SessionRequestRoute;