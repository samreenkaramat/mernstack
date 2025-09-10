import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./database/db.js";
import userroutes from "./routes/userroutes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/User", userroutes);

// Database connect
ConnectDB();

app.listen(PORT, () => {
  console.log(`server is listening at port ${PORT}`);
});
