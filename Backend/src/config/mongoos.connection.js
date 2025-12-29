import mongoose from "mongoose";


const url = process.env.MONGODB_CONNECTION_URL;
export async function Connectmongoos() {
    try {
        const connection = await mongoose.connect(url)
        console.log(`mogodb is connected using mongoose ${connection}`);
    } catch (error) {
        console.log(`The error is ${error.message}`);

    }
}