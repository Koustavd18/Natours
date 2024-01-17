const mongoose = require("mongoose");
const dotenv = require("dotenv");

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

//

// const testTour = new Tour({
//   name: "The Park Camper",
//   price: 400,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log("Error :", err);
//   });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[INFO] Server is running at localhost:${port}....`);
});
