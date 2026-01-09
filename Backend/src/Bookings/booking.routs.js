import express from "express"
import BookingFlights from "./booking.controler.js"
import jwtAuth from "../middlewares/jwt.auth.js";
import AccessControl from "../middlewares/access.control.js";
const bookingrouts = express.Router();

//Booking rout
bookingControler = new BookingFlights();
bookingrouts.post("/booking", jwtAuth, AccessControl("users", "admin"), (req, res, next) => {
bookingControler.CreateBooking(req,res,next);
})

//Payment rout
bookingrouts.post("/payment", jwtAuth, AccessControl("users", "admin"), (req, res, next) => {
bookingControler.PaymentCreate(req,res,next);
})


//cancalbooking rout
bookingrouts.delete("/cancal", jwtAuth, AccessControl("admin"), (req, res, next) => {
bookingControler.cancelbooking(req,res,next);
})

export default bookingrouts;