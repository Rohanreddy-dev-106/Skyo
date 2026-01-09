import bookingrepo from "./booking.repository.js"

export default class BookingFlights{
    _bookingrepo;
    constructor(){
        this._bookingrepo=new bookingrepo;
    }
    async CreateBooking(req,res,next){

    }
    async PaymentCreate(req,res,next){

    }
     async CancalBooking(req,res,next){

    }
}