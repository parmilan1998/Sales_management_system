const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const categoryRoute = require("./routes/categoryRoute.js");
const bodyParser = require("body-parser");
const db = require("./database/db.js");

dotenv.config();

// initialize express app
const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

// Routes
app.use("/api/v1/category", categoryRoute);

const PORT = 8080 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
