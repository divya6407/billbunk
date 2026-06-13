import mongoose from "mongoose";

const connectdb = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅mongodb connected succesfully");
    }
    catch(err){
        console.log(`❌mongodb failed to connect ${err.message}`);
        process.exit(1);
    }
    
}
export default connectdb;