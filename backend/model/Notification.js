import mongoose from 'mongoose'


const NotificationSchema = new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, ' the recipient is required to send message']
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, ' the sender is required to send message']
    },
    message:{
        type:String,
        required:[true,' message is required'],
        trim:true
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


export const Notification = mongoose.model("Notification", NotificationSchema);
