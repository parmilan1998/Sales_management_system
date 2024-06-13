import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from './routes/productRoute.js'
import bodyParser from "body-parser";

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
 app.use("/api/v1/product", productRoute);

const PORT = 8080 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
