const express = require("express");
const router = express.Router();
const {SignupUser , LoginUser, LoginAdmin, SignupAdmin} = require("../controllers/AuthController");
const VerifyTokenAndRole = require("../middlewares/AuthMiddleWare");

router.post("/signup" , SignupUser);
router.post("/login" , LoginUser);
router.post("/add-admin" ,VerifyTokenAndRole(["Admin"]) , SignupAdmin);
router.post("/login-admin" , LoginAdmin);

module.exports = router;