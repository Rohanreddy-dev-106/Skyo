import express from "express";
import FlightController from "./flight.controler.js";
import AccessControl from "../middlewares/access.control.js";
import jwtAuth from "../middlewares/jwt.auth.js";
const FlightRouts = express.Router();

const flight = new FlightController();


FlightRouts.post("/create", jwtAuth,AccessControl("admin"), (req, res, next) => {
    flight.create(req, res, next);
})

FlightRouts.put("/update/:id", jwtAuth, AccessControl("admin"), (req, res, next) => {
    flight.update(req, res, next);
});

//FIXME: ORGINAL ROUT

//FlightRouts.get("/read",jwtAuth, AccessControl("admin", "user"), (req, res, next) => { flight.read(req, res, next); })

//TODO:For Testing
FlightRouts.get("/read", (req, res, next) => {
    flight.read(req, res, next);
})


FlightRouts.delete("/delete/:id", jwtAuth,AccessControl("admin"), (req, res, next) => {
    flight.delete(req, res, next);
})



FlightRouts.get("/search", (req, res, next) => {
    flight.search(req, res, next);
});

FlightRouts.post("/seats-add",(req,res,next)=>flight.Add(req,res,next))


export default FlightRouts;