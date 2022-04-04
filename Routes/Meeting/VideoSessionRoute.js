const express = require("express");
const VideoSessionRoute = express.Router();

const VideoSessionController = require("../../Controller/Meeting/VideoSessionController");

const JWTAuth = require("../../Middleware/JWTAuth");

VideoSessionRoute.post("/startvideosession", JWTAuth, VideoSessionController.startvideosession);
VideoSessionRoute.post("/endvideosession", JWTAuth, VideoSessionController.endvideosession);
VideoSessionRoute.post("/joinvideosession", JWTAuth, VideoSessionController.joinvideosession);
VideoSessionRoute.post("/disconnectvideosession", JWTAuth, VideoSessionController.disconnectvideosession);
VideoSessionRoute.post("/getconnectvideosession", JWTAuth, VideoSessionController.getconnectvideosession);
VideoSessionRoute.post("/getvideosessionlist", JWTAuth, VideoSessionController.getvideosessionlist);
module.exports = VideoSessionRoute;