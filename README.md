<p align="center">
  <img 
    src="Skyo.png"
    alt="Skyo Logo"
    width="140"
    style="border-radius: 50%;"
  />
</p>

<h1 align="center"> Skyo</h1>

<p align="center">
  A scalable and secure backend system for a Flight Booking Application
</p>


## 🚀 Features

### 🔐 Authentication & Authorization

* User registration & login
* Email verification using OTP
* Secure password handling
* JWT-based authentication
* Role-based access (Admin / User)

### ✈️ Flight Management

* Create, update, delete flights (Admin)
* View all available flights
* Flight details with source, destination, time, price, and seats

### 🔍 Advanced Filters

* Filter flights by **price range**
* Filter flights by **departure time**
* Filter by **source & destination**
* Filter by **available seats**

### 📖 Booking System

* Book flights
* Passenger details management
* Seat availability validation
* Prevent overbooking

### 🧱 Architecture & Design

* MVC + Repository pattern
* Clean separation of concerns
* Centralized error handling
* Scalable folder structure

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT, OTP-based email verification
* **Tools:** Postman, Git, GitHub

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## ▶️ Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/your-username/Flight-Booking-Application.git
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the server**

```bash
npm run dev
```

Server will run at: `http://localhost:5000`

---

## 🧪 API Testing

* Tested using **Postman**
* Secure endpoints protected with JWT
* Validations applied for all inputs

---

## 🎯 Learning Outcomes

* Real-world backend system design
* MongoDB schema design & relations
* Authentication flows with OTP
* Repository pattern in Node.js
* Writing clean and maintainable backend code

---

## 🔮 Future Enhancements

* Seat selection UI support
* Flight cancellation & refunds UI
* Admin analytics dashboard UI
* Payment gateway integration

---

## 👨‍💻 Author

**Rohan Reddy**
Self-taught Full Stack Developer | DSA & Backend Enthusiast
GitHub: [https://github.com/Rohanreddy-dev-106](https://github.com/Rohanreddy-dev-106)

---

⭐ If you like this project, give it a star and feel free to fork it!

