import { redis } from "../services/redis.io.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

async function SendOtp(req, res, next) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send("Email is required");
        }

        //OTP generation moved here
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Store OTP in Redis 
        await redis.set(`otp:${email}`, otp, "EX", 300);//(5 minutes expiry)

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: "alta.conn70@ethereal.email",
                pass: "8zdYqrx88aK2ZDPTmV",
            },
        });

        const message = {
            from: "baron.abshire@ethereal.email",
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}`,
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 30px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background:#0a74da; padding:20px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:24px;">✈️ Flight Booking</h1>
              <p style="margin:5px 0 0; font-size:14px;">Secure Email Verification</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <h2 style="margin-top:0;">Verify your email address</h2>
              <p style="font-size:15px; line-height:1.6;">
                Thank you for choosing <strong>Flight Booking</strong>.
                Use the OTP below to verify your email and continue booking your flights.
              </p>

              <!-- OTP Box -->
              <div style="margin:30px 0; text-align:center;">
                <span style="display:inline-block; background:#f1f5ff; color:#0a74da; font-size:32px; letter-spacing:6px; padding:15px 25px; border-radius:6px; font-weight:bold;">
                  ${otp}
                </span>
              </div>

              <p style="font-size:14px; color:#555;">
                ⏳ This OTP is valid for <strong>5 minutes</strong>.  
                Please do not share it with anyone.
              </p>

              <p style="font-size:14px; color:#555;">
                If you didn’t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Flight Booking Application  
              <br/>
              Safe travels ✈️
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

        };

        await transporter.sendMail(message);

        return res.status(200).json({
            message: "OTP sent to email"
        });

    } catch (error) {
        console.log("Send OTP Error:", error.message);
        res.status(500).send("Failed to send OTP");
    }
}

export default SendOtp;
