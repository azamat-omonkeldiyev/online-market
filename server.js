process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config({path: "./src/config/.env"});
const {ConnectDb} = require("./src/config/db");
const UserRoute = require("./src/route/user.route");
const orderRoutes = require("./src/route/user.route");
const regionRegion = require("./src/route/region.route");


const express = require("express");
const app = express();
app.use(express.json());

app.use("/user", UserRoute);
app.use("/orders", orderRoutes);
app.use("/region", regionRegion);
ConnectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));