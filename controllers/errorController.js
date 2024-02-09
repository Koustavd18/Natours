const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = (err) => {
  // const value = err.errmsg.match(/([" '])(\\?.)*?\1/);

  const value = err.keyValue.name;
  // eslint-disable-next-line no-useless-escape
  const message = `Duplicate field value used: \"${value}"\. Please use another value`;
  return new AppError(message, 400);
};

const handlevalidationDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const errorType = Object.keys(err.errors);

  const message = `Invalid Input data for fields -> ${errorType.join(", ")}. Reason -> ${errors.join(". ")}`;

  // console.log(err);

  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError("You are Not logged In. Log in again", 401);

const handleJWTExpired = (err) =>
  new AppError("Session Expired, Please Log In again", 401);

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error 💥", err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateDB(error);
    if (err.name === "ValidationError") error = handlevalidationDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError(error);
    if (err.name === "TokenExpiredError") error = handleJWTExpired(error);
    sendErrProd(error, res);
  } else if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
