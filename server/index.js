const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const stockRoute = require("./routes/stockroute.js")
const purchaseRoute = require("./routes/purchaseRoute");
const salesRoute = require("./routes/salesRoute");
const userRoute = require("./routes/userRoute");
const reportRoute = require("./routes/reportRoute");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const db = require("./database/db.js");

dotenv.config();

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

//Middleware for parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/stocks", salesRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/sales", salesRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/reports", reportRoute);

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
