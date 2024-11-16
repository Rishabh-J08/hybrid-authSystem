require("dotenv").config();
const express = require('express');
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");

const cors = require('cors');
const app = express();

connectDB();
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }))
app.use(express.json());
app.use("/api/auth", authRoutes);

module.exports = app;