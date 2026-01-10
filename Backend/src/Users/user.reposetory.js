import { users } from "./user.schema.js";
import bcrypt from "bcrypt"

export default class Users {
    async Register(data) {
        try {
            const user = new users(data);
            await user.save();
            return user;
        }
        catch (err) {
            console.log(err.message);

        }
    }
    async Findemail(mail) {
        try {
            const email = await users.findOne({ email: mail })
            if (!email) {
                return null;
            }
            return email;
        }
        catch (err) {
            console.log(err.message);

        }
    }

    async Resetpassword(id, newpassword) {
        try {
            if (!id || !newpassword) {
                console.log("User ID and new password are required");

            }
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            const reset = await users.findByIdAndUpdate(id,
                { $set: { password: hashedPassword } }, { new: true });
            return reset;
        } catch (err) {
            console.log(err.message);

        }
    }

    //refreshtoken set
    async StoreRefreshToken(id, token) {
        try {
            const refreshT = await users.findByIdAndUpdate(id, { $set: { refreshToken: token } }, { new: true });
            return refreshT;
        } catch (error) {
            console.log(error.message);

        }
    }
    async GetRefreshToken(id) {
        try {
            const docfind = await users.findById(id);
            return docfind.refreshToken;
        } catch (error) {
            console.log(error.message);

        }
    }
    async FindUser(id) {
        try {
            return await users.findById(id);
        }
        catch (err) {
            console.log(err.message);

        }
    }
    async clearToken(id) {
        try {
            return await users.findByIdAndUpdate(id, { $set: { refreshToken: "NULL" } })
        }
        catch (err) {
            console.log(err.message);

        }
    }

    //Admin/Users Level api

    async Getallusers(roll) {
        try {
            return await users.find();
        } catch (err) {
            console.log(err.message);

        }
    }

    //Update Profile 
    async UpdateProfile(id, data) {
        try {
            const filterdata = {};//safe update
            for (let key in data) {
                filterdata[key] = data[key];
            }
            const update = await users.findByIdAndUpdate(id, { $set: filterdata }, { new: true });
            return update;
        } catch (error) {
            console.log(error.message);

        }
    }

}