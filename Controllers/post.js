// https://www.npmjs.com/package/multer?activeTab=readme
const fs=require('fs');
const Post=require('../models/postschema');
require('dotenv').config();
const jwt=require('jsonwebtoken');

exports.createpost=async(req,res)=>{
    try{
        const token=req.body.token || req.cookies.token ;
        // console.log(token);
        if(!token){
            return res.status(401).json({
                success:false,
                message:`Token missing`,
            })
        }
        try{
            const payload=jwt.verify(token,process.env.JWT_SECERT);
            console.log("verfication done");
            // res.json(payload);
            // unable to create post if the user is not logged in
            const {originalname,path}=req.file;
            const parts=originalname.split('.');
            const ext=parts[parts.length-1];
            // res.json({ext});
            const newpath=path+'.'+ext;
            fs.renameSync(path,newpath);

            const{title,summary,content}=req.body;
            // res.json({title,summary,content});
            let createdPost=await Post.create({
                title,
                summary,
                content,
                coverimage:newpath,
                author:payload.id,
            });
            return res.status(200).json({
                status:true,
                createdPost,
                message:"Post created successfully"
            })
        }
        catch(e){
            return res.status(401).json({
                success:false,
                message:"Invalid token",
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

exports.getposts=async(req,res)=>{
    try{
        
        const posts=await Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20);
        res.status(200).json({
            status:true,
            posts
        })
        // res.json(posts); 
    }
    catch(err){
        return res.status(500).json({
            status:false,
            data:"Internal server error",
            message:err.message,
        })
    }
}

exports.singlepost=async(req,res)=>{
    try{
        const {id}=req.params;
        const singlepost= await Post.findById(id).populate('author',['username']) ;
        return res.status(200).json({
            singlepost,
        });
        // res.json(id);
    }
    catch(e){
        res.status(500).json({
            status:false,
            data:"Internal server error",
            message:e.message,
        })
    }
}
exports.editpost= async(req,res)=>{
    // res.json({test:4,fileIs:req.file});
    let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }
//   console.log(newPath);
  const {token} = req.cookies;
  jwt.verify(token, process.env.JWT_SECERT, {}, async (err,info) => {
        if (err) throw err;
        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
        return res.status(400).json('you are not the author');
        }
        const updatedPost=await Post.findByIdAndUpdate(id,{
        title,
        summary,
        content,
        coverimage: newPath ? newPath : postDoc.coverimage,
        });

        // console.log(id,summary,content,title,"updated data");
        // console.log(updatedPost);
        res.json({fileIs:req.file,updatedPost});
        // console.log(postDoc,"database data",info);
    });
  
}