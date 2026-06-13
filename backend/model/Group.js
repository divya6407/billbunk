import mongoose from "mongoose";
import crypto from "crypto";
const GroupSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A Group name is required'],
        trim:true,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }],
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    code:{
        type:String,
        required:[true,"The code is required"],
        unique:true,
        lowercase:true,
    }
},{timestamps:true});
GroupSchema.index({name:"text"});
GroupSchema.pre("validate",function (){
    if(!this.code){
        this.code=crypto.randomBytes(3).toString('hex').toLowerCase();
    }
})
export default mongoose.model("Groups",GroupSchema);