import mongoose from "mongoose";

const ConnectDB=async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URL}/note-app`);
        console.log("mongodb connected successfully");
    }
    catch (error) {
    console.log("mongodb connection error", error);
}

}
export default ConnectDB;