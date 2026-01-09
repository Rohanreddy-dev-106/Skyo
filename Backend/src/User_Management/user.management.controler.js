import Usermanagementrepo from "./user.management.repo.js";

export default class FlightFilterController {
    _FlightRepo;

    constructor() {
        this._FlightRepo = new Usermanagementrepo();
    }

    // FILTER BY PRICE
    async filterByPrice(req, res, next) {
        try {
            const { min, max } = req.query;
            const flights = await this._FlightRepo.FilterbyPrice(Number(min), Number(max));
            return res.status(200).json(flights);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

    // FILTER BY TIME
    async filterByTime(req, res, next) {
        try {
            const { min, max } = req.query;
            const flights = await this._FlightRepo.FilterbyTime(new Date(min), new Date(max));
            return res.status(200).json(flights);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

    // FILTER BY PLACE
    async filterByPlace(req, res, next) {
        try {
            const { source, destination } = req.query;
            const flights = await this._FlightRepo.Filterbyplace(source, destination);
            return res.status(200).json(flights);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

    // FILTER BY SEATS
    async filterBySeats(req, res, next) {
        try {
            const { minSeats, maxSeats } = req.query;
            const flights = await this._FlightRepo.FilterbySets(Number(minSeats), Number(maxSeats));
            return res.status(200).json(flights);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

    // ADMIN DASHBOARD
    async adminDashboard(req, res, next) {
        try {
            const skip = Number(req.query.skip) || 0;
            const limit = Number(req.query.limit) || 10;
            const data = await this._FlightRepo.AdminDashboard(skip, limit);
            return res.status(200).json(data);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }
}
