import Flight from "./flight.repository.js";

export default class FlightController {
    _Flightrepo;

    constructor() {
        this._Flightrepo = new Flight();
    }

    // CREATE FLIGHT
    async create(req, res, next) {
        try {
            const result = await this._Flightrepo.CreateFlight(req.body);
            return res.status(201).json(result);
        } catch (err) {
            console.log(err.message);

        }
    }

    // UPDATE FLIGHT
    async update(req, res, next) {
        try {
            const { id } = req.params;  // flight ID from URL
            const data = await this._Flightrepo.Find(id);

            if (!data) {
                return res.status(404).json({ message: "Flight owner not found" });
            }

            // Ownership check
            if (data.Howcreated !== req.user.UserID) {
                return res.status(403).json({ message: "Not authorized" });
            }
            const result = await this._Flightrepo.UpdateFlight(id, req.body);

            if (!result) {
                return res.status(404).json({ message: "Flight not found" });
            }

            return res.status(200).json(result);

        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: err.message });
        }
    }


    // READ ALL FLIGHTS
    async read(req, res, next) {
        try {
            const flights = await this._Flightrepo.ReadFlights();
            return res.status(200).json(flights);
        } catch (err) {
            console.log(err.message);
        }
    }

    // DELETE FLIGHT
    async delete(req, res, next) {
        try {
            const { id } = req.params;  // flight ID from URL
            const data = await this._Flightrepo.Find(id);
            // Ownership check
            if (data.Howcreated !== req.user.UserID) {
                return res.status(403).json({ message: "Flight owner not found" })
            }
            const result = await this._Flightrepo.DeleatFlight(id);

            if (!result) {
                return res.status(404).json({ message: "Flight not found" });
            }

            return res.status(200).json(result);

        } catch (err) {
            console.log(err.message);
        }
    }

    // SEARCH FLIGHT
    async search(req, res, next) {
        try {
            const { id, flightName } = req.query;
            const flight = await this._Flightrepo.Search(id, flightName);

            if (!flight) return res.status(404).json({ message: "Flight not found" });

            return res.status(200).json(flight);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

    //ADD SEATS
    async Add(req, res, next) {
        try {
            const data = req.body;

            const addsets = await this._Flightrepo.AddSets(data);

            return res.status(201).json({
                success: true,
                message: "Seats added successfully",
                data: addsets
            });

        } catch (error) {
            console.log(error.message);

        }
    }


}
