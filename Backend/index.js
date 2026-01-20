import express from "express";
import userrouts from "./src/Users/user.routs.js";
import FlightRouts from "./src/Flights_Management/flight.routs.js";
import router from "./src/User_Management/user.management.routes.js";
import bookingrouts from "./src/Bookings/booking.routs.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const server=express();
server.use(express.json())//Postman
server.use(express.urlencoded({ extended: true }));//Data comming from HTML forms
server.use(cookieParser())
server.use(cors({
    origin: "*" // allow all origins
}));


// server.get("/",(req,res,next)=>res.status(200).send("Server is Created..."))
server.use("/api/user",userrouts);
server.use("/api/flights",FlightRouts);
server.use("/api/user-management",router);
server.use("/api/booking",bookingrouts)

server.use((req, res, next) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Page Not Found</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body {
          background: linear-gradient(135deg, #1d1d1fff 0%, #57436bff 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .error-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(76, 71, 71, 0.3);
          padding: 3rem;
          max-width: 600px;
          text-align: center;
        }
        .error-code {
          font-size: 6rem;
          font-weight: 700;
          color: #030303ff;
          margin: 0;
          line-height: 1;
        }
        .error-message {
          font-size: 1.5rem;
          color: #0a0a0aff;
          margin: 1rem 0;
          font-weight: 600;
        }
        .error-description {
          color: #e61111ff;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .btn-primary {
          background: linear-gradient(135deg, #314bc1ff 0%, #9453d4ff 100%);
          border: none;
          padding: 12px 32px;
          font-weight: 600;
          border-radius: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(21, 45, 153, 0.4);
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #667eea, transparent);
          margin: 2rem 0;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1 class="error-code">404</h1>
        <h2 class="error-message">Page Not Found</h2>
        <p class="error-description">
          The requested resource could not be located on this server. 
          Please verify the URL or consult our API documentation for available endpoints.
        </p>
        <div class="divider"></div>
        <a href="/api-doc-rohan" class="btn btn-primary">
          View API Documentation
        </a>
      </div>
    </body>
    </html>
  `);
});

export{server};