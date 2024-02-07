const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION.💥 Shutting Down Server.... ");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

// Mongo Connection handlers

mongoose.connect(DB);

mongoose.connection.on("connected", () => {
  console.log("[INFO] Mongo Connection ESTABLISHED");
});

mongoose.connection.on("reconnected", () => {
  console.log("[INFO] Mongo Connection Re-ESTABLISHED");
});

mongoose.connection.on("disconnected", () => {
  console.log("[INFO] Mongo is DISCONNECTED");
});

mongoose.connection.on("close", () => {
  console.log("[INFO] Mongo Connection CLOSED");
});

mongoose.connection.on("error", (error) => {
  console.log("[ERROR] Mongo Connection Error: ", error);
  throw error;
});

const port = process.env.PORT || 6969;

const server = app.listen(port, () => {
  console.log(`[INFO] Server is running at localhost:${port}....`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("[ERROR] UNHANDLER REJECTION. 💥Shutting Down");
  server.close(() => {
    process.exit(1);
  });
});
