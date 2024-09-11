const path = require('path');
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import connectMongodb from "./db/connectMongodb.js";
import cookieParser from "cookie-parser";

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);

app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({ extended: true })); //to parse form data (urlencoded)
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if(process.env.NODE_ENV === 'production'){
  app.use('*' , (req,res) => {
    res.sendFile(path.resolve(__dirname,'front','dist','index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`server is running on port :${PORT}`);
  connectMongodb();
});
