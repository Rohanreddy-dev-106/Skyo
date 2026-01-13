import Bookingmodel from "./booking.schema.js";
import Paymentmodel from "./payment.schema.js";
import SeatsModel from "../Flights_Management/seats.schema.js";

export default class BookingRepo {
    async creatbooking(data) {
        try {

            const booking = new Bookingmodel({ ...data, Cost: 0 });
            //Befor saving a validation check
            let isAlreadyBooked = false;
            let seatID = "";
            const check = await SeatsModel.find({ _id: { $in: booking.Seat } });
            check.forEach((value) => {//Logical Bug i made :When you use return inside a forEach callback, it only returns from the callback not from total function
                if (value.status === "booked") {
                    isAlreadyBooked = true;
                    seatID = value._id
                }
            })
            if (isAlreadyBooked) return { message: `${seatID} This seat is Booked by some one please Try another` }

            const bookingSaved = await booking.save();

            // Update booking cost
            const result = await this.updateBookingCost(bookingSaved._id);


            // Update all selected seats to booked
            if (bookingSaved.Seat && bookingSaved.Seat.length > 0) {//extra safty
                await SeatsModel.updateMany(
                    { _id: { $in: bookingSaved.Seat } },
                    {
                        $set: {
                            status: "booked",
                            bookedBy: bookingSaved.User
                        }
                    }
                );
            }

            return [bookingSaved._id, result];
        } catch (error) {
            console.log(error.message);
        }
    }


    async payment(data, Booking_id) {
        try {
            const booking = await Bookingmodel.findById(Booking_id);
            const amount = booking.Cost;
            const payment = new Paymentmodel({ ...data, Amount: amount });

            if (this.HelpingMethod()) {
                payment.Status = "Success";
                const payID = await payment.save();

                return {
                    message: "Payment is Success",
                    payment_id: payID._id
                };

            } else {
                payment.Status = "Failed";
                await payment.save();

                // Cancel booking
                await Bookingmodel.findByIdAndUpdate(
                    Booking_id,
                    { $set: { Status: "Cancelled" } }
                );

                const booking = await Bookingmodel.findById(Booking_id);

                // Free the seats
                await SeatsModel.updateMany(
                    { _id: { $in: booking.Seat } },
                    {
                        $set: {
                            status: "available",
                            bookedBy: null
                        }
                    }
                );

                return {
                    message: "Payment is Failed",
                    Booking: "Cancelled"
                };
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    // Helper method to simulate a payment gateway
    HelpingMethod() {
        return Math.random() < 0.8; // 80% chance of payment success
    }

    async TotalCost(bookingId) {
        const booking = await Bookingmodel.findOne({ _id: bookingId })
            .populate({
                path: "Seat",
                select: "price -_id" // only price field in Seats, exclude _id
            });

        if (!booking) {
            return 0;
        }


        const totalcost = booking.Seat.reduce((accumulator, value) => {//The accumulator stores the running result and gets updated with each iteration.
            return accumulator + value.price;
        }, 0);

        return totalcost;
    }
    async updateBookingCost(bookingId) {
        try {

            const total_cost = await this.TotalCost(bookingId);


            const updatedBooking = await Bookingmodel.findByIdAndUpdate(
                bookingId,
                { $set: { Cost: total_cost } },
                { new: true }
            );

            return updatedBooking;
        } catch (error) {
            console.log("Error updating booking cost:", error.message);
            return null;
        }
    }

    //Admin api

    async Cancellation(bookingId, paymentId, seatIds = []) {
        await Bookingmodel.findByIdAndDelete(bookingId);

        await Paymentmodel.findByIdAndDelete(paymentId);

        await SeatsModel.updateMany(
            { _id: { $in: seatIds } },
            {
                $set: {
                    status: "available",
                    bookedBy: null
                }
            }
        );
    }

}
