require("dotenv").config({path: "./src/config/.env"});
const {ConnectDb} = require("./src/config/db");

const express = require("express");
const app = express();

ConnectDb()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));