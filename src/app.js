const express = require("express");
const cors = require("cors");

const servicecatergories = require("../routes/v1/servicesCategoryRoutes");
const usersRoutes = require("../routes/v1/userRoutes");
const marketCategoryRoutes = require("../routes/v1/marketCategoryRoutes");
// const expenseRoutes = require("../routes/v1/expenseRoutes");
// const notificationRoutes = require("../routes/v1/notificationRoutes");

const app = express();

//Middwares
app.use(cors());
app.use(express.json());

//Routes
app.use("/v1/users", usersRoutes);
app.use("/v1/servicecategories", servicecatergories);
app.use("/v1/marketcategories", marketCategoryRoutes);
// app.use("/v1/expenses", expenseRoutes);
// app.use("/v1/notifications", notificationRoutes);

//Export
module.exports = app;
