const express = require("express");
const AccountRoute = express.Router();

const AccountController = require("../../Controller/Trainer/AccountController");

const JWTAuth = require("../../Middleware/JWTAuth");
const { RegistrationValidator, UpdateProfileValidator, LoginValidator, ResetPasswordValidator } = require("../../Middleware/Validation/Trainer/Validation");

AccountRoute.post("/register", JWTAuth, RegistrationValidator, AccountController.register);
AccountRoute.post("/updateTrainerPara", JWTAuth, AccountController.updateTrainerPara);
AccountRoute.post("/login", JWTAuth, LoginValidator, AccountController.login);
AccountRoute.get("/logout", JWTAuth, AccountController.logout);
AccountRoute.get("/getprofile", JWTAuth, AccountController.getprofile);
AccountRoute.post("/updateprofile", JWTAuth, UpdateProfileValidator, AccountController.updateprofile);
AccountRoute.post("/passwordlink", JWTAuth, AccountController.forgotpassword);
AccountRoute.post("/resetpassword/:encryptedstr", ResetPasswordValidator, AccountController.resetpassword);
AccountRoute.post("/updatetrainertype", JWTAuth, AccountController.updateTrainerType);
module.exports = AccountRoute;