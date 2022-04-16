const express = require("express");
const AccountRoute = express.Router();

const AccountController = require("../../Controller/Client/AccountController");

const JWTAuth = require("../../Middleware/JWTAuth");
const { RegistrationValidator, UpdateProfileValidator, LoginValidator, ResetPasswordValidator } = require("../../Middleware/Validation/Client/Validation");

AccountRoute.post("/register", JWTAuth, RegistrationValidator, AccountController.register);
AccountRoute.post("/verifyemailexists", JWTAuth, AccountController.verifyemailexists);
AccountRoute.post("/login", JWTAuth, LoginValidator, AccountController.login);
//AccountRoute.post("/adminusers", JWTAuth, LoginValidator, AccountController.adminusers);
AccountRoute.get("/getprofile", JWTAuth, AccountController.getprofile);
AccountRoute.post("/getprofilebyid", JWTAuth, AccountController.getprofilebyid);
AccountRoute.post("/updateprofile", JWTAuth, UpdateProfileValidator, AccountController.updateprofile);
AccountRoute.get("/getNotification", JWTAuth, AccountController.getNotification);
AccountRoute.post("/updateNotification", JWTAuth, AccountController.updateNotification);
AccountRoute.post("/passwordlink", JWTAuth, AccountController.forgotpassword);
AccountRoute.post("/resetpassword/:encryptedstr", ResetPasswordValidator, AccountController.resetpassword);
AccountRoute.get("/getprogressphotos", JWTAuth, AccountController.getprogressphotos);
AccountRoute.post("/saveprogressphotos", JWTAuth, AccountController.saveprogressphotos);
module.exports = AccountRoute;