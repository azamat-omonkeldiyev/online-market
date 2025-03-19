const express = require("express");
const router = express.Router();
// const roleMiddleware = require("./../middleware/roleAuth");
const userController = require("./../controller/user-auth.controller");
router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/send-otp", userController.sendOtp);

router.post("/verify-otp", userController.verify);

router.post("/refresh", userController.refresh);

router.get("/", userController.getUsers);

router.get("/:id",  userController.getUserById);

router.patch("/:id", userController.updateUser);

router.delete("/:id",  userController.deleteUser);



module.exports = router;