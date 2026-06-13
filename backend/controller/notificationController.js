import {Notification }from '../model/Notification.js'
import { Expense } from '../model/Expense.js';
import asyncHandler from '../utils/asyncHandler.js'

export const getnoti =asyncHandler(async(req,res)=>{
    const noti = await Notification.find({recipient:req.user._id});
    if(!noti)
    {
        return res.status(404).json({
            success:false,
            message:'No notifications are received'
        })
    }
    res.json({
        success:true,
        data:noti
    });
})

export const markread = asyncHandler(async(req,res)=>{
    const noti= await Notification.findById(req.params.notiid);
    if (!noti) {
        return res.status(404).json({
            success: false,
            message: 'No notifications are received'
        })
    }
    const updatednoti = await Notification.findByIdAndUpdate(
            req.params.notiid,
            {isRead:true},
            { isRead: true }, 
            {  returnDocument: 'after' }
        );
    res.json({
        success: true,
        data: updatednoti
    });

})


export const deletenoti = asyncHandler(async (req, res) => {
    const noti = await Notification.findById(req.params.notiid);
    if (!noti) {
        return res.status(404).json({
            success: false,
            message: 'No notifications are received'
        })
    }
    const updatednoti = await Notification.findByIdAndDelete(
        req.params.notiid,
        { isRead: true },
        { returnDocument: 'after' }
    );
    res.json({
        success: true,
        message:"the notification is deleted successfully"
    });

})

