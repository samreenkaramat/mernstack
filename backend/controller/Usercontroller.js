import {User} from "../model/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser=async(req,res)=>{
    try {
        const {username,email,password,role}=req.body;
        if(!username || !email || !password)
        {
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"user already exist"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=await User.create({username,email,password:hashedPassword,role: role || "user"})
        return res.status(201).json({
            success:true,
            message:"User created Successfully",
            data:newUser
        })
    } catch (error) {
        return res.status(500).json(error.message)
        
    }
}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // password check (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // JWT generate
    const token = jwt.sign({ id: user._id,role: user.role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // ✅ Cookie me token save
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: false, // agar HTTPS ho to true
      sameSite: "strict",
    });

    // ✅ DB me save bhi karo (taake logout pe clear ho sake)
    user.token = token;
    user.isLoggedin = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token, // optional: frontend me bhi bhej do
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "No refresh token found" });

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY);

    const user = await User.findOne({ _id: decoded.id, token });
    if (!user) return res.status(403).json({ success: false, message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token expired or invalid" });
  }
};


export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

    const user = await User.findOne({ token });
    if (user) {
      user.token = null;
      user.isLoggedin = false;
      await user.save();
    }

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};