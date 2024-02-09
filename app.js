const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//Middlewares

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Welcome to Natours 🤟🏻");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Controllers

const home = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Welcome to Natours",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

// Route Handlers

app.route("/").get(home);

app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", userRouter);

/*
    Error Handling
*/

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find this ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

console.log(`[INFO] Current Environment is [${app.get("env")}]`);

module.exports = app;
