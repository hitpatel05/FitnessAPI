const express = require("express");
const AccountRoute = express.Router();

const AccountController = require("../../Controller/Admin/AccountController");

const JWTAuth = require("../../Middleware/JWTAuth");
const { LoginValidator, ResetPasswordValidator } = require("../../Middleware/Validation/Admin/Validation");

AccountRoute.post("/login", JWTAuth, LoginValidator, AccountController.login);
AccountRoute.get("/adminusers", JWTAuth, AccountController.adminusers);
AccountRoute.post("/passwordlink", JWTAuth, AccountController.forgotpassword);
AccountRoute.post("/resetpassword/:encryptedstr", ResetPasswordValidator, AccountController.resetpassword);

module.exports = AccountRoute;