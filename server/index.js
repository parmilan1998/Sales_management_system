import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import categoryRoute from "./routes/categoryRoute.js";
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
// app.use("/api/v1/category", categoryRoute);

const PORT = 8080 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
