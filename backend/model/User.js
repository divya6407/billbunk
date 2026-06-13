import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'name is required'],
            trim:true,
        },
        email:{
            type:String,
            required:[true,'email is required'],
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:[true,'password is required'],
            minlength:[6 ,'password must be atleast of 6 characters'],
            select:false //must be there so that password will not be included while querying
        },
        groups:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Group",
        }]
        
    }
    , { timestamps: true }
);

UserSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return ;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    
});

UserSchema.methods.comparePassword=async function(userpassword){
    return bcrypt.compare(userpassword,this.password);
}

export default mongoose.model("User",UserSchema);

