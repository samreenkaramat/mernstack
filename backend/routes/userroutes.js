import express from "express"
import { User } from "../model/UserSchema.js";
import {registerUser,login,refreshToken,logout} from '../controller/Usercontroller.js'
import { verifyToken, authorizeRoles } from "../middleware/authmiddleware.js";
import rateLimit from "express-rate-limit";
const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,  
  handler: (req, res, next) => {
    res.status(429).json({ success: false, message: "Too many login attempts, try again later" });
  }
});



router.post('/register',registerUser)
router.post("/login",loginLimiter, login);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});


// Admin Only
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;