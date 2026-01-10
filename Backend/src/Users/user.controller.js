import userrepo from "./user.reposetory.js";
import { redis } from "../services/redis.io.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class UserController {
    _userrepository;

    constructor() {
        this._userrepository = new userrepo();
    }

    async Register(req, res, next) {
        try {
            const { name, email, password, role, refreshToken } = req.body;
            const hashpassword = await bcrypt.hash(password, 12);
            const data = {
                "name": name,
                "email": email,
                "password": hashpassword,
                "role": role,
                "refreshToken": refreshToken

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
            //Create JWT tokens
            const accesstoken = this.generateAccessToken(user);
            const refreshtoken = await this.generateRefreshToken(user);

            const EXPIRE = 6 * 24 * 60 * 60 * 1000;

            // Store token in cookie
            res.cookie("jwtToken", accesstoken, {
                maxAge: EXPIRE,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshtoken, {
                httpOnly: true,
            });

            return res.status(200).send({
                message: "Login successful"
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

    generateAccessToken(user) {
        return jwt.sign(
            { UserID: user._id, email: user.email, role: user.role },
            process.env.JWT_TOKEN_KEY,
            {
                algorithm: "HS256",
                expiresIn: "6d"
            }
        );
    }

    async generateRefreshToken(user) {
        const refreshtoken = jwt.sign(
            { UserID: user._id },
            process.env.REFRESH_TOKEN_KEY,
            {
                algorithm: "HS256",
                expiresIn: "30d"
            }
        );

        await this._userrepository.StoreRefreshToken(
            user._id,
            refreshtoken
        );

        return refreshtoken;
    }

    async RefreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;

            const refresh_paylode = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_KEY
            );

            const id = refresh_paylode.UserID;

            const oldrefreshtoken = await this._userrepository.GetRefreshToken(id);

            if (refreshToken !== oldrefreshtoken) {
                return res.status(404).send("Token not found");
            }

            const user = await this._userrepository.FindUser(id);

            const accesstoken = this.generateAccessToken(user);
            const refreshtoken = await this.generateRefreshToken(user);

            const EXPIRE = 6 * 24 * 60 * 60 * 1000;

            res.cookie("jwtToken", accesstoken, {
                maxAge: EXPIRE,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshtoken, {
                httpOnly: true,
            });

            return res.status(200).json({ message: "Token is found.." });

        } catch (error) {
            return res.status(401).send("Invalid or expired token");
        }
    }


    async logout(req, res, next) {
        try {
            await this._userrepository.clearToken(req.user.UserID);
            res.clearCookie("jwtToken", {
                httpOnly: true,
            });
            res.clearCookie("refreshToken", {
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
