const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const app = express();

//Set up a basic Socket.IO server
const socketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnect");
  });
});

// Make the Socket.IO instance available to your routes
app.set("socketio", io);

const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const stockRoute = require("./routes/stockRoute.js");
const purchaseRoute = require("./routes/purchaseRoute");
const salesRoute = require("./routes/salesRoute");
const userRoute = require("./routes/userRoute");
const reportRoute = require("./routes/reportRoute");
const notificationRoute = require("./routes/notificationRoute");
const unitRoute = require("./routes/unitRoute");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const db = require("./database/db.js");

const Sales = require("./models/sales");
const SalesDetail = require("./models/salesDetails");
const Product = require("./models/products");
const Stocks = require("./models/stocks");
const Unit = require("./models/unit.js");

dotenv.config();

//Middleware for parse JSON bodies
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
// Middleware to parse cookies
app.use(cookieParser());

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => res.send("Express on Vercel"));

app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/stocks", stockRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/sales", salesRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/reports", reportRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/unit", unitRoute);

const exphbs = require("express-handlebars");

app.set("views", path.join(__dirname, "public/views"));

// Create an instance of express-handlebars with custom configurations
const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, "public/views/layouts"),
  defaultLayout: "index",
});

// Set the view engine to handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("main", { layout: "index" });
});

app.get("/invoice", (req, res) => {
  res.render("invoice", { layout: "index" });
});
const PORT = process.env.PORT || 5000;

// Define associations
Sales.hasMany(SalesDetail, { foreignKey: "salesID", as: "details" });
SalesDetail.belongsTo(Sales, { foreignKey: "salesID", targetKey: "salesID" });
SalesDetail.belongsTo(Unit, { foreignKey: "unitID", as: "unit" });

SalesDetail.belongsTo(Product, {
  foreignKey: "productID",
  targetKey: "productID",
});
SalesDetail.belongsTo(Stocks, { foreignKey: "stockID", targetKey: "stockID" });

Unit.hasMany(SalesDetail, { foreignKey: "unitID", as: "details" });

Product.hasMany(Stocks, { foreignKey: "productID" });
Stocks.belongsTo(Product, { foreignKey: "productID" });

db.sync()
  .then(() => {
    console.log("Database synced successfully");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing Purchase table:", error);
  });
