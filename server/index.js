const express = require('express');
require('dotenv').config();
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
// const connectDB = require('./db');

// database connection
connection();

// middleware
app.use(express.json())
app.use(cors());
app.use(express.json({ limit: 1024102420, type: "application/json" }));
app.use("*", (req, res, next) => {
    console.info({
      scope: "Request",
      data: {
        ip: req.header["x-forwarded-for"] || req.socket.remoteAddress,
        url: req.originalUrl,
        method: req.method,
        body: req?.body,
        date: new Date().toUTCString(),
      },
    })
    next();
  });

//routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)




const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App is listening ${port}`)
})

// connectDB();