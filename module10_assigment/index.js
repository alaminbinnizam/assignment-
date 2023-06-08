import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from "./Config/db.js";
import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoutes.js'
import cors from "cors";

//configure
dotenv.config();
//data base configure
connectDB();


const app = express();
//middlewares
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product', productRoutes)

//restapi
app.get('/', (req, res)=>{
    res.send({
        message:'Module10 assignment'
    })
})

//port
const PORT = process.env.PORT || 8060

//run listen
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})