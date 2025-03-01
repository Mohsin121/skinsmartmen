const express = require("express");
const UserRoute = require("./user");
const AuthRoute = require("./auth");



const router = express.Router();

router.use("/user", UserRoute);
router.use("/auth", AuthRoute);



module.exports = router;
