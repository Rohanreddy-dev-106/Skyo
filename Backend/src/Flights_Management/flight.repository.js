import Flightmodel from "./flight.schema.js";
import seatsSchema from "./seats.schema.js";
export default class Flight {
    //Private
    async CreateFlight(data) {
        try {
            const created = new Flightmodel(data);
            await created.save();
            return { message: "Flight is Created.." }
        }
        catch (err) {
            console.log(err.message);
        }
    }
    //Private
    async UpdateFlight(flight_id, data) {
        try {
            const flight_profile = {};
            for (let key in data) { // extra safety
                flight_profile[key] = data[key];
            }
            const update = await Flightmodel.findByIdAndUpdate(flight_id, { $set: flight_profile }, { new: true });
            return { message: "flight is updated", update }
        } catch (err) {
            console.log(err.message);

        }

    }
    //Private
    async DeleatFlight(flight_id) {
        try {
            await Flightmodel.findByIdAndDelete(flight_id);
            return { message: "flight is deleted" }
        } catch (err) {
            console.log(err.message);

        }
    }
    //Public
    async ReadFlights() {
        try {
            return await Flightmodel.find();
        } catch (error) {
            console.log(err.message);
        }
    }
    //Public
    async Search(flight_id = null, flightName = null) {
        try {
            const query = {};
            if (flight_id) {
                query._id = flight_id;
            } else {
                throw new Error("Invalid flight ID");
            }
            if (flightName) {
                query.Flightname = flightName;
            }

            return await Flightmodel.findOne(query);
        }
        catch (err) {
            console.log(err.message);
        }
    }
    //Private
    async Find(flight_id) {
        try {
            return await Flightmodel.findById(flight_id);
        } catch (err) {
            console.log(err.message);

        }
    }
    //private

    async AddSets(data) {
        try {
            const Sets = new seatsSchema(data);
            await Sets.save();
        } catch (error) {
            console.log(error.message);

        }
    }
}