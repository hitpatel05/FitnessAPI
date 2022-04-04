const express = require("express");
const AccountRoute = express.Router();

const AccountController = require("../Controller/AccountController");

const JWTAuth = require("../Middleware/JWTAuth");

AccountRoute.get("/VerifyToken", JWTAuth, AccountController.VerifyToken);

module.exports = AccountRoute;