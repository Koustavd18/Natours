const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const viewRouter = require("./routes/viewRoutes");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//! Middlewares
//Cross Origin Resource Sharing
app.use(cors());

// Set Security HTTP headers
app.use(helmet());

//Static Pages

app.use(express.static(path.join(__dirname, "public")));

// Set View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Body parser
app.use(express.json({ limit: "500kb" }));

//Cookie Parser
app.use(cookieParser());

//parameter pollution
app.use(
  hpp({
    whitelist: ["duartion", "sort"],
  }),
);

//Data Sanitazation (NoSQL Query Injection and XSS)
app.use(mongoSanitize());
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Requests, Try again in an hour",
});

app.use("/api", limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
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

app.use("/", viewRouter);

app.route("/home").get(home);

app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/reviews", reviewRouter);

/*
    Error Handling
*/

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find this ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

console.warn(`[INFO] Current Environment is [${app.get("env")}]`);

module.exports = app;
