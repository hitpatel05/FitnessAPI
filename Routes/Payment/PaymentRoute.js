const express = require("express");
const PaymentRoute = express.Router();

const PaymentController = require("../../Controller/Payment/PaymentController");

const JWTAuth = require("../../Middleware/JWTAuth");

PaymentRoute.post("/getintent", JWTAuth, PaymentController.getintent);
PaymentRoute.post("/savepayment", JWTAuth, PaymentController.savepayment);
PaymentRoute.get("/getplan", JWTAuth, PaymentController.getplan);

module.exports = PaymentRoute;