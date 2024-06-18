const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const purchaseRoute = require("./routes/purchaseRoute");
const stockRoute = require("./routes/salesRoute.js");

const bodyParser = require("body-parser");
const db = require("./database/db.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/sales", stockRoute);

const PORT = process.env.PORT || 5000;

db.sync()
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing Purchase table:", error);
  });
