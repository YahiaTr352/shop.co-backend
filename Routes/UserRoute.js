const express = require("express");
const router = express.Router();
const {EditUser , DeleteUser , GetUser , GetAllUsers, GetUsersByRole, GetOk} = require("../controllers/UserController");
const VerifyTokenAndRole = require("../middlewares/AuthMiddleWare");

router.get("/ok" , GetOk);
router.put("/update-user/:id" ,VerifyTokenAndRole(["Admin"]) , EditUser);
router.delete("/delete-user/:id" ,VerifyTokenAndRole(["Admin"]) , DeleteUser);
router.get("/user/:id" ,VerifyTokenAndRole(["Admin"]), GetUser);
router.get("/get-all-users" ,VerifyTokenAndRole(["Admin"]) , GetAllUsers);
router.get("/get-users" ,VerifyTokenAndRole(["Admin"]) , GetUsersByRole);

module.exports = router;

