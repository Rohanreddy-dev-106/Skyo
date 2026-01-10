import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../middlewares/jwt.auth.js";
import AccessControl from "../middlewares/access.control.js";
import SendOtp from "../middlewares/otp.send.js";
import VerifyOtp from "../middlewares/otp.verfication.js";
const userrouts = express.Router();
const Controller = new UserController()
userrouts.post("/register", (req, res, next) => {
    Controller.Register(req, res, next);
});

userrouts.post("/login", (req, res, next) => {
    Controller.Login(req, res, next);
});

userrouts.delete("/logout", jwtAuth, AccessControl("users", "admin"), (req, res, next) => {
    Controller.logout(req, res, next);
});
userrouts.post("/otp-send", (req, res, next) => {
    SendOtp(req, res, next);
});

userrouts.post("/otp-verify", VerifyOtp, (req, res,next) => {
    res.status(200).json({
        message: "Email verified successfully"
    });
});
userrouts.put("/profile-update", jwtAuth, AccessControl("users", "admin"), (req, res,next) => {
    Controller.Profileupdate(req, res, next);
});

userrouts.post("/refresh-token",(req,res,next)=>{
    Controller.RefreshToken(req,res,next);
})

export default userrouts;