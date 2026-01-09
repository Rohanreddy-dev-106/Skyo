import flightmodel from "../Flights_Management/flight.schema.js";

export default class Usermanagementrepo {

    async FilterbyPrice(min, max) {
        try {
            const filter_data = await flightmodel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] });
            return filter_data;
        }
        catch (err) {
            console.log(err.message);

        }
    }

    async FilterbyTime(min, max) {
        try {
            const filter_data = await flightmodel.find({ $and: [{ startTime: { $gte: min } }, { endTime: { $lte: max } }] });
            return filter_data;
        }
        catch (err) {
            console.log(err.message);

        }
    }
    async Filterbyplace(source, destination) {
        try {
            const filter_data = await flightmodel.find({ source, destination });
            return filter_data;
        }
        catch (err) {
            console.log(err.message);

        }
    }

    async FilterbySets(maisets, maxsets) {
        try {
            const filter_data = await flightmodel.find({ $and: [{ totalseats: { $gte: maisets } }, { totalseats: { $lte: maxsets } }] });
            return filter_data;
        }
        catch (err) {
            console.log(err.message);

        }
    }

    //Aggrection Apis for  admin dashboard
    async AdminDashboard(skip, limit) {
        try {
            const filter_data = await flightmodel.aggregate([
                {
                    $group: {
                        _id: "$airline",
                        Flights: { $push: "$Flightname" },
                        avgprise: { $avg: "$price" }
                    }
                },
                {
                    $sort: { avgprise: -1 },
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ])
            return filter_data;
        } catch (error) {
            console.log(error.message);

        }
    }
}




