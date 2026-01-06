import userrepo from "./user.reposetory.js";
import { redis } from "../services/redis.io.js";
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export default class UserController {
    _userrepository;
    constructor() {
        this._userrepository = new userrepo();
    }
    async Register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;
            const hashpassword = await bcrypt.hash(password, 12);
            const data = {
                "name": name,
                "email": email,
                "password": hashpassword,
                "role": role
            }
            const isVerified = await redis.get(`email_verified:${email}`);
            if (!isVerified) {
                return res.status(400).json({ message: "Email not verified" });
            }

            await this._userrepository.Register(data);
            res.status(201).json({ "message": "user is Registered.." })
        } catch (error) {
            console.log("Signup Error:", error.message);
            res.status(500).send("Signup failed");
        }
    }
    async Login(req, res, next) {
        const { email, password } = req.body;

        // Try to get user from Redis cache
        let cachedUser = await redis.get(`user:${email}`);
        let user = null;

        if (cachedUser) {
            user = JSON.parse(cachedUser);
        }
        else {
            // Fetch user from DB if not in Redis
            user = await this._userrepository.Findemail(email);
            if (!user) return res.status(404).send("User not found");

            // Store user in Redis for future logins
            await redis.set(`user:${email}`, JSON.stringify(user));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).send("User not found");
        }
        else {
            //Create JWT token

            const token = jwt.sign(
                { UserID: user._id, email: user.email, role: user.role },
                process.env.JWT_TOKEN_KEY,
                {
                    algorithm: "HS256",
                    expiresIn: "6d",
                }
            );
            // 6 days in milliseconds
            const EXPIRE = 6 * 24 * 60 * 60 * 1000;

            // Store token in cookie
            res.cookie("jwtToken", token, {
                maxAge: EXPIRE,
                httpOnly: true,
            });

            return res.status(200).json({
                "message": "Login successful",
                "user": user.name
            });
        }
    }
    async Profileupdate(req, res, next) {
        try {
            const { data } = req.body;
            const updatedprofile = await this._userrepository.UpdateProfile(data);
            return res.status(500).send({
                message: "Profile is updated.."
            });
        }
        catch (err) {
            return res.status(200).send({
                message: "Profile is not updated.."
            });
        }
    }
    async logout(req, res, next) {
        try {
            res.clearCookie("jwtToken", {
                httpOnly: true,
            });

            return res.status(200).send({
                message: "Logout successful"
            });

        } catch (error) {
            console.log("Logout Error:", error.message);
            res.status(500).send("Logout failed");
        }
    }
}