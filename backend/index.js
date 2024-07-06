import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import authRoutes from './routes/auth.routes.js'

import connectMongodb from './db/connectMongodb.js';
import cookieParser from 'cookie-parser';


const app = express();


const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({extended: true})); //to parse form data (urlencoded)
app.use(cookieParser());
app.use('/api/auth',authRoutes);


app.listen(PORT,()=>{
    console.log(`server is running on port :${PORT}`)
    connectMongodb();
    
})