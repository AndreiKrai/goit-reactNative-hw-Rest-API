const app = require("./app");
const mongoose = require("mongoose");
// construction to get data from .env file with paswords and keys
const dotenv = require("dotenv");
dotenv.config();
const { DB_HOST, PORT = 3000 } = process.env;

mongoose.set("strictQuery", false);

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(PORT))
  .then(() => console.log("Database connection successful"))
  .catch((err) => {
    console.log(err.message);
    // якщо поилка, то завершує незакінчені процеси на сервері
    process.exit(1);
  });
