import mongoose from "mongoose";

const UserSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isLoggedin:
    {
        type:Boolean,
         default:false
    },
    token:{
        type:String,
        default:null
    },
     role:
      { type: String, 
        enum: ["user", "admin"],
         default: "user" 
        }

},{timestamps:true})

export const User=mongoose.model("User",UserSchema)
