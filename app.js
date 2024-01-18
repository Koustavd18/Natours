const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//Middlewares

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Hello from the Custom Middleware 🤟🏻");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Controllers

const home = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Natours",
  });
};

// Route Handlers

app.route("/").get(home);

app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", userRouter);

// app.patch("/api/v1/tours/:id", );

// app.delete("/api/v1/tours/:id", );

console.log(`[INFO] Current Environment is [${app.get("env")}]`);

module.exports = app;
