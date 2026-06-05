const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware")

const { registerUser,loginUser } = require("../controllers/userController")

router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/profile",protect,(req,res)=>{
    res.status(200).json({
        success: true,
        user: req.user,
    })
})

module.exports = router;