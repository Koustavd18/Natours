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

// app.patch("/api/v1/tours/:id", );
// app.delete("/api/v1/tours/:id", );

/*
    Error Handling
*/

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "failed",
  //   message: `Can'to findo thiso ${req.originalUrl}`,
  // });

  const err = new Error("Canto findo thiso");
  err.status = "failed";
  err.statusCode = 409;

  next(err);
});

app.use((err, req, res, next) => {
  err.status = err.status || "Error";
  err.statusCode = err.statusCode || 505;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next();
});

console.log(`[INFO] Current Environment is [${app.get("env")}]`);

module.exports = app;
