import Flight from "./flight.repository.js";

export default class FlightController {
    _Flightrepo;

    constructor() {
        this._Flightrepo = new Flight();
    }

    // CREATE FLIGHT
    async create(req, res, next) {
        try {
            const flightData = {
                ...req.body,
                Howcreated: req.user.UserID
            };
            const result = await this._Flightrepo.CreateFlight(flightData);
            return res.status(201).json(result);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Failed to create flight" });
        }
    }

    // UPDATE FLIGHT
    async update(req, res, next) {
        try {
            const { id } = req.params;
            
            const data = await this._Flightrepo.Find(id);

            if (!data) {
                return res.status(404).json({ message: "Flight not found" });
            }

            // Ownership check
            if (data.Howcreated.toString() !== req.user.UserID.toString()) {
                return res.status(403).json({ message: "Not authorized" });
            }
            
            const result = await this._Flightrepo.UpdateFlight(id, req.body);

            if (!result) {
                return res.status(404).json({ message: "Update failed" });
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
            return res.status(500).json({ message: "Failed to read flights" });
        }
    }

    // DELETE FLIGHT
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            
            const data = await this._Flightrepo.Find(id);
            
            if (!data) {
                return res.status(404).json({ message: "Flight not found" });
            }

            // Ownership check
            if (data.Howcreated.toString() !== req.user.UserID.toString()) {
                return res.status(403).json({ message: "Not authorized to delete this flight" });
            }
            
            const result = await this._Flightrepo.DeleatFlight(id);

            if (!result) {
                return res.status(404).json({ message: "Delete failed" });
            }

            return res.status(200).json(result);

        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Failed to delete flight" });
        }
    }

    // SEARCH FLIGHT
    async search(req, res, next) {
        try {
            const { id, flightName } = req.query;
            const flight = await this._Flightrepo.Search(id, flightName);

            if (!flight) {
                return res.status(404).json({ message: "Flight not found" });
            }

            return res.status(200).json(flight);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

    // ADD SEATS
    async Add(req, res, next) {
        try {
            const data = req.body;

            const seatId = await this._Flightrepo.AddSets(data);
            await this._Flightrepo.pushSEATS(data.flight, seatId);

            return res.status(201).json({
                success: true,
                message: "Seat added and linked to flight successfully",
                seatId
            });

        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Failed to add seat" });
        }
    }
}