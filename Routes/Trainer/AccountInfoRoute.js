const express = require("express");
const AccountInfoRoute = express.Router();

const AccountInfoController = require("../../Controller/Trainer/AccountInfoContoller");

const JWTAuth = require("../../Middleware/JWTAuth");
const { AccountInfoValidator } = require("../../Middleware/Validation/Trainer/Validation");

AccountInfoRoute.post("/saveaccountinfo", JWTAuth, AccountInfoValidator, AccountInfoController.SaveAccountInfo);

module.exports = AccountInfoRoute;