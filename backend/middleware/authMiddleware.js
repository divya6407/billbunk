import jwt from 'jsonwebtoken';
import User from '../model/User.js';

let token;

export const protect = async (req,res,next)=>{
    if(req.headers.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Not authorized - no token is provided"
        });
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:'user belong to this token no longer exist',
            });
        }
        next();

    }catch(err){
        err.name==='TokenExpiredError'?"Token has expired - please log in again":"Invalid token";
        return res.status(401).json({
            success:false,
            message:err.message
        });
    }
};