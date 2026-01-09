import mongoose, { Schema } from "mongoose";

const SeatsSchema = new Schema(
    {
        flight: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "flights",
            required: true,
            index: true
        },

        seatNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

        seatClass: {
            type: String,
            enum: ["economy", "business"],
            default: "economy"
        },

        price: {
            type: Number,
            min: 500,
            required: true
        },

        status: {
            type: String,
            enum: ["available", "booked", "cancelled"],
            default: "available"
        },

        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null
        },
        createdBY: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null
        }
    },
    {
        timestamps: true,
    }
);


export default mongoose.model("Seat", SeatsSchema);
