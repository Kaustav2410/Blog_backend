const express = require('express');
const cors=require('cors');
const app = express();
const cookieParser=require('cookie-parser');
// https://stackoverflow.com/questions/67551382/how-to-install-node-module
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
const multer=require('multer');
const upload=multer({dest: 'uploads/'});
app.use('/uploads',express.static(__dirname+'/uploads'));

require('dotenv').config();
const PORT=process.env.PORT || 5000;

const blogRoutes=require("./routes");
app.use("/",blogRoutes);

const dbConnect=require('./config/database');
dbConnect();

// app.post('/register',(req,res)=>{
//     const {username,password}=req.body;
//     res.json({requestData:{username,password}});
// });

app.listen(PORT);
