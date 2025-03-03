"use strict";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookie_parser = require("cookie-parser");
const express_session = require("express-session");
const memorystore = require("memorystore");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const Memorystore = memorystore(express_session);

const serviceCatergoriesRoutes = require("../routes/v1/servicesCategoryRoutes");
const usersRoutes = require("../routes/v1/userRoutes");
const marketCategoryRoutes = require("../routes/v1/marketCategoryRoutes");
const marketRoutes = require("../routes/v1/marketRoutes");
const serviceRoutes = require("../routes/v1/servicesRoutes");
const monnifyPaymentRoute = require("../routes/v1/monnifyPaymentRoutes");
const monnifyWebhookRoute = require("../routes/v1/monnifyWebhookRoutes");
const errorController = require("../controllers/v1/errorController");

const app = express();

//Middwares
app.use(cors());
app.use(express.json());

// Security and Performance Enhancements
app.use(helmet());
app.use(compression());

// Logging
app.use(morgan("dev"));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, slow down!" },
});
app.use(limiter);

// Secure Cookies & Sessions
app.use(cookie_parser());
app.use(
  express_session({
    store: new Memorystore({
      checkPeriod: 86400000,
    }),
    secret: process.env.SESSION_SECRET, // Use .env file
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 86400000,
    },
  })
);

// // CORS (Restrict to Specific Domains)
// const corsOptions = {
//     origin: ["https://yourfrontend.com", "https://admin.yourfrontend.com"],
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     credentials: true,
// };
// app.use((cors(corsOptions));

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on server`,
    404,
    "Fail"
  );
  next(err);
});

// app.use(errorController());

exports = app;



//Routes
app.use("/v1/users", usersRoutes);
app.use("/v1/servicecategories", serviceCatergoriesRoutes);
app.use("/v1/marketcategories", marketCategoryRoutes);
app.use("/v1/marketplaces", marketRoutes);
app.use("/v1/services", serviceRoutes);
app.use("/v1/invoice/create", monnifyPaymentRoute);
app.use("/v1/webhook", monnifyWebhookRoute);

//Export
module.exports = app;
