const express = require("express");
const AdminRoute = express.Router();

const AdminController = require("../../Controller/Admin/AdminController");
const JWTAuth = require("../../Middleware/JWTAuth");


AdminRoute.post("/getworkoutcategory", JWTAuth, AdminController.getworkoutcategory);
AdminRoute.post("/saveworkoutcategory", JWTAuth, AdminController.saveworkoutcategory);
AdminRoute.post("/deleteworkoutcategory", JWTAuth, AdminController.deleteworkoutcategory);
AdminRoute.post("/getstaff", JWTAuth, AdminController.getstaff);
AdminRoute.post("/savestaff", JWTAuth, AdminController.savestaff);
AdminRoute.post("/deletestaff", JWTAuth, AdminController.deletestaff);
AdminRoute.post("/getgoalstypes", JWTAuth, AdminController.getgoalstypes);
AdminRoute.post("/savegoalstypes", JWTAuth, AdminController.savegoalstypes);
AdminRoute.post("/deletegoalstypes", JWTAuth, AdminController.deletegoalstypes);
AdminRoute.post("/getequipments", JWTAuth, AdminController.getequipments);
AdminRoute.post("/saveequipments", JWTAuth, AdminController.saveequipments);
AdminRoute.post("/deleteequipments", JWTAuth, AdminController.deleteequipments);
AdminRoute.post("/getplan", JWTAuth, AdminController.getplan);
AdminRoute.post("/saveplan", JWTAuth, AdminController.saveplan);
AdminRoute.post("/deleteplan", JWTAuth, AdminController.deleteplan);
AdminRoute.post("/ratinglist", JWTAuth, AdminController.ratinglist);
AdminRoute.post("/deleterating", JWTAuth, AdminController.deleterating);
AdminRoute.post("/workoutlist", JWTAuth, AdminController.workoutlist);
AdminRoute.post("/trainerlist", JWTAuth, AdminController.trainerlist);
AdminRoute.post("/clientlist", JWTAuth, AdminController.clientlist);
AdminRoute.post("/savenotification", JWTAuth, AdminController.savenotification);
AdminRoute.get("/notificationlist", JWTAuth, AdminController.notificationlist);
AdminRoute.post("/savesetting", JWTAuth, AdminController.savesetting);
AdminRoute.post("/getSettingbycode", JWTAuth, AdminController.getSettingbycode);
AdminRoute.get("/settinglist", JWTAuth, AdminController.settinglist);
AdminRoute.post("/trainerBookinglist", JWTAuth, AdminController.trainerBookinglist);
AdminRoute.post("/clientBookinglist", JWTAuth, AdminController.clientBookinglist);

module.exports = AdminRoute;