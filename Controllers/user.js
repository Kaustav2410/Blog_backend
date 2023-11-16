const User=require("../models/userschema");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const secret=process.env.JWT_SECERT;

exports.register=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const existingUser=await User.findOne({username});
        if (!existingUser){ 
            const salt=bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password,salt) ;
            const newUser= await User.create({username,
                password:hashedPassword
            });
            res.status(200).json({
                user:newUser,
                message:` New user is created`
            })
        }
        else{
            res.status(409).json({
                status:false,
                message:"User with this username already exists"
            })
        }
    }
    catch(err){
        res.status(500).json({
            status:false,
            data:"Internal server error",
            message:err.message,
        })
    }
}

exports.login=async(req,res)=>{
    try{
        const {username,password}=req.body;
        let existingUser=await User.findOne({username});
        // Dont use different res.json together if you do it will give error write all the things inside a single json
        // res.json(existingUser);
        if(existingUser){
            let payload={
                id:existingUser._id,
                username:existingUser.username,
            }
            if(await bcrypt.compareSync(password,existingUser.password)){
                // Logged in
                let token=jwt.sign(payload,secret,{expiresIn:"2h"});
                existingUser=existingUser.toObject();
                existingUser.token=token;
                existingUser.password=undefined;

                const options={
                    expires:new Date(Date.now()+30000*100),
                    httpOnly:true,
                }

                res.cookie('token',token,options).status(200).json({
                    success:true,
                    id:existingUser._id,
                    username:existingUser.username,
                    // token,
                    message:"User Logged in Successfully"
                })
            }
            else{
                res.status(401).json({
                    status:false,
                    message:"Wrong password"
                })
            }
        }
        else{
            res.status(401).json({
                status:false,
                message:"No user found with this username"
            })
        }
    }
    catch(e){
        res.status(500).json({
            status:false,
            message:e.message
        })
    }
}

exports.logout=async(req,res)=>{
    res.cookie('token','').json('ok');
}