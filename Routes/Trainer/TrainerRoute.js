const express = require("express");
const TrainerRoute = express.Router();

const TrainerController = require("../../Controller/Trainer/TrainerController");

const JWTAuth = require("../../Middleware/JWTAuth");

TrainerRoute.post("/trainerlist", JWTAuth, TrainerController.trainer);
TrainerRoute.post("/savetrainerlist", JWTAuth, TrainerController.savetrainerlist);
TrainerRoute.post("/deletetrainer", JWTAuth, TrainerController.deletetrainer);
TrainerRoute.post("/searchtrainer", JWTAuth, TrainerController.searchtrainer);
TrainerRoute.post("/savetrainer", JWTAuth, TrainerController.savetrainer);
TrainerRoute.get("/myratings", JWTAuth, TrainerController.trainerrating);
TrainerRoute.post("/gettrainer", JWTAuth, TrainerController.trainerdetails);
TrainerRoute.get("/getworkoutcategory", JWTAuth, TrainerController.getworkoutcategory);

module.exports = TrainerRoute;