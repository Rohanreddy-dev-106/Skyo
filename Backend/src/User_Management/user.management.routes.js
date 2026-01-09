import express from "express";
import FlightFilterController from "./user.management.controler.js";
import AccessControl from "../middlewares/access.control.js";
import jwtAuth from "../middlewares/jwt.auth.js";

const router = express.Router();
const flightFilterController = new FlightFilterController();

// Filter flights by price
router.get(
    "/filter/price",
    jwtAuth,
    AccessControl("user", "admin"),
    (req, res, next) => flightFilterController.filterByPrice(req, res, next)
);

// Filter flights by departure & arrival time
router.get(
    "/filter/time",
    jwtAuth,
    AccessControl("user", "admin"),
    (req, res, next) => flightFilterController.filterByTime(req, res, next)
);

// Filter flights by source and destination
router.get(
    "/filter/place",
    jwtAuth,
    AccessControl("user", "admin"),
    (req, res, next) => flightFilterController.filterByPlace(req, res, next)
);

// Filter flights by number of seats
router.get(
    "/filter/seats",
    jwtAuth,
    AccessControl("user", "admin"),
    (req, res, next) => flightFilterController.filterBySeats(req, res, next)
);

// Get admin dashboard data (airline-wise flights and avg price)

router.get(
    "/admin/dashboard",
    jwtAuth,
    AccessControl("admin"),
    (req, res, next) => flightFilterController.adminDashboard(req, res, next)
);

export default router;
