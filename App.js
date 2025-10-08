require("dotenv").config();
const express = require("express");
const connectDB = require("./config/Config");
const authRoutes = require("./Routes/AuthRoute");
const userRoutes = require("./Routes/UserRoute");
const productRoutes = require("./Routes/ProductRoute");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
connectDB();
const port = process.env.PORT;

app.use(express.json());

app.use("/upload", express.static(path.join(__dirname, "upload")));


app.use("/api/users" , authRoutes);
app.use("/api/users" , userRoutes);
app.use("/api/products" , productRoutes);

app.listen(port , ()=> {
    console.log(`server is running on port ${port}`);
}) 

module.exports = app;