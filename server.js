process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config({path: "./src/config/.env"});
const {ConnectDb} = require("./src/config/db");
const UserRoute = require("./src/route/user.route");
const commentRoute = require('./src/route/comment.route')
const productRoute = require('./src/route/product.route')
const categoryRoute = require('./src/route/category.route')

const express = require("express");
const app = express();
app.use(express.json());

<<<<<<< HEAD
app.use("/user", UserRoute);
app.use("/product", productRoute)
app.use("/comment", commentRoute)
app.use("/categoryu", categoryRoute)

=======
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/users", UserRoute);
app.use("/orders", orderRoutes);
app.use("/regions", regionRegion);
app.use("/upload", uploadRoute);
app.use("/image", express.static(path.join(__dirname, "src", "uploads")));
>>>>>>> da4001028d742922d4204da590ab45905ffca229
ConnectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));