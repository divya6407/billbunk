// first singin the user and create a token then add to db and check wheather its already exist
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../model/User.js"

const signToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE||'7d',
    });
}

export const register = asyncHandler(async(req,res)=>{
    const {name,email,password}= req.body;
    if(!name||!email||!password){
        return res.status(400).json({
            success:false,
            message:"Please provide name,email and password to continue registering",
        });
    }
    const existinguser = await User.findOne({email});
    if(existinguser){
        return res.status(400).json({
            success:false,
            message:'Email already registered',
        });
    }
    const user = await User.create({name,email,password});
    const token = signToken(user._id);
    res.status(201).json({
        success:true,
        token,
        user:{
            id:user._id,
            name:user.name,
        },
    });

});

export const login =asyncHandler(async (req,res)=>{
    const {email,password}= req.body;
    if(!email||!password){
        return res.status(400).json({
            success:false,
            message:"Please enter the email and password",
        });
    }
    const user = await User.findOne({email}).select('+password');
    if(!user||!(await user.comparePassword(password))){
        return res.status(400).json({
            success:false,
            message:'Invalid email or password.'
        });
    }
    const token = signToken(user._id);
    res.json({
        success:true,
        token,
        user:{
            id:user._id,
            name:user.name,
        },
    });
});


export const getme = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
})

export const getmembers = asyncHandler(async(req,res)=>{
    const { name } = req.query;
    const users = await User.find({
        name: { $regex: String(name), $options: 'i' }
    });
    if(users.length===0){
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    res.status(200).json({
        success: true,
        data: users
    });
})