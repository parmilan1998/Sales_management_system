<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoute = require('./routes/productRoute');
const bodyParser = require('body-parser');
=======
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const categoryRoute = require("./routes/categoryRoute");
const bodyParser = require("body-parser");
const db = require("./database/db.js");
>>>>>>> f2ffd389922820ad69b48d6185f8f1e521825b5e

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/v1/product', productRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
