const express = require('express');
const router=express.Router();
const multer=require('multer');
const upload=multer({dest: 'uploads/'});

const {register,login,logout}=require("./Controllers/user");
const {auth}=require("./middlewares/auth");
const {createpost,getposts,singlepost,editpost}=require("./Controllers/post");

router.post("/register",register);
router.post("/login",login);
router.get("/profile",auth,(req,res)=>{
    return res.json({
        success:true,
        message:"Authentication completed",
    })
});
router.post("/createpost",upload.single('file'),createpost);
router.get("/post",getposts);
router.get("/post/:id",singlepost);
router.put("/post",upload.single('file'),editpost);
router.post("/logout",logout);

module.exports=router; 