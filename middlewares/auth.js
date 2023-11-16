const jwt=require('jsonwebtoken');
require('dotenv').config();

exports.auth=(req,res,next)=>{
    try{
        const token=req.body.token || req.cookies.token 
        // || req.header("Authorization").replace("Bearer","");
        // console.log("b: "+req.cookies['token'] );
        // console.log("cookie: "+req.cookies.token );
        // const token=req.cookies['token'];
        // console.log(token);
        if(!token){
            return res.status(401).json({
                success:false,
                message:`Token missing`,
            })
        }
        try{
            const payload=jwt.verify(token,process.env.JWT_SECERT);
            console.log("verfication done"),
            res.json(payload);
        }
        catch(e){
            return res.status(401).json({
                success:false,
                message:"Invalid token",
            })
        }
        next();
    }
    catch(e){
        res.status(401).json({
            success:false,
            message:e.message,
        })
    }
}