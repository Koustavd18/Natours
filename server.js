const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log("[INFO] MongoDB Server Connected"))
  .catch((err) => {
    console.log(err);
  });

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
