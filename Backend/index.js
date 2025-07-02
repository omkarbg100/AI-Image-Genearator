import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js';
import userRouter from './routes/User.Routes.js';
import ImageRouter from './routes/Image.Routes.js';

const PORT = process.env.PORT || 3000;
const app=express();

app.use(express.json())
app.use(cors());

await connectDB();


app.use('/api/user',userRouter);
app.use('/api/image',ImageRouter);

app.get('/',(req,res)=>{
    res.send("<h1>hello</h1>");
})

app.listen(PORT,(req,res)=>{
    console.log(`the Port is listed on ${PORT}`)
})