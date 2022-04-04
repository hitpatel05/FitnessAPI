const express = require("express");
const ClientRoute = express.Router();

const ClientController = require("../../Controller/Client/ClientController");

const JWTAuth = require("../../Middleware/JWTAuth");

ClientRoute.get("/clientlist", JWTAuth, ClientController.client);
ClientRoute.post("/getclient", JWTAuth, ClientController.clientdetails);
ClientRoute.post("/searchclient", JWTAuth, ClientController.searchclient);
ClientRoute.post("/deleteclient", JWTAuth, ClientController.deleteclient);
ClientRoute.get("/getprofile", JWTAuth, ClientController.getclient);
ClientRoute.post("/saveclient", JWTAuth, ClientController.saveclient);
ClientRoute.post("/bookmarktrainer", JWTAuth, ClientController.bookmarktrainer);
ClientRoute.post("/blockreporttrainer", JWTAuth, ClientController.blockreporttrainer);
ClientRoute.post("/blockreportclient", JWTAuth, ClientController.blockreportclient);
module.exports = ClientRoute;