import { Expense}  from "../model/Expense.js";
import  Group  from "../model/Group.js"
import { Notification } from "../model/Notification.js";
import asyncHandler from "../utils/asyncHandler.js"
export const createExpense = asyncHandler(async(req,res)=>{
    const {title,description,amount,category,groupId,paidBy,splitType,splitDetails,status}= req.body;
    const grp = await Group.findById(req.body.groupId);
    
    
        const expense = await Expense.create({
            title, description, amount, category, groupId, paidBy, splitType, splitDetails, status
        });
        res.status(200).json({
            success:true,
            data:expense
        });
});

export const getExpenseById = asyncHandler(async(req,res)=>{
    const expense = await Expense.findById(req.params.expid).populate('splitDetails.userId','name');
    if(!expense){
        return res.status(404).json({
            success:false,
            message:'Expense not found'
        });
    }
    res.status(200).json({
        success:true,
        data:expense
    });
});

export const expenseForGroup = asyncHandler(async(req,res)=>{
    const expense = await Expense.find({groupId:req.params.grpid}).populate('splitDetails.userId','name');
    if(!expense){
        return res.status(400).json({
            success:false,
            message:'No Expenses are available'
        });
    }
    res.status(200).json({
        success:true,
        data:expense
    });
});

export const getpersonalbill=asyncHandler(async(req,res)=>{
    const expense = await Expense.find({paidBy:req.user._id,groupId:null});
    if(!expense){
        return res.status(400).json({
            success: false,
            message: 'No Expenses are available'
        });
    }
    res.status(200).json({
        success: true,
        data: expense
    });
});


export const updateexpense = asyncHandler(async(req,res)=>{
    let expense = await Expense.findById(req.params.expid);
    if(!expense){
        return res.status(404).json({
            success: false,
            message: 'Expense not found'
        });
    }
    const updatedexpense = await Expense.findByIdAndUpdate(req.params.expid, req.body,  { returnDocument: 'after' }
);
    res.status(200).json({
        success: true,
        data: updatedexpense 
    });
})

export const deleteexpense = asyncHandler(async (req, res) => {
    let expense = await Expense.findById(req.params.expid);
    if (!expense) {
        return res.status(404).json({
            success: false,
            message: 'Expense not found'
        });
    }
    expense = await Expense.findByIdAndDelete(req.params.expid);
    res.status(200).json({
        success: true,
        message:"deleted successfully"
    });
})

export const confirmsettle = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.expid);
    if (!expense) return res.status(404).json({ success: false, message: "Expense not Found." });

    const { notiid, senderid } = req.body;

    // DEBUG: Check what IDs are actually being compared
    console.log("Looking for SenderID:", senderid);
    console.log("Available UserIDs in Split:", expense.splitDetails.map(s => s.userId.toString()));

    const userSplit = expense.splitDetails.find((s) => s.userId.toString() === senderid.toString());

    if (!userSplit) {
        return res.status(404).json({
            success: false,
            message: "The user was not found in this split details array."
        });
    }

    // 1. Update the value
    userSplit.isPaid = true;

    // 2. CRITICAL: Tell Mongoose the array has changed
    expense.markModified('splitDetails');

    // 3. Update the overall status if everyone paid
    const isEverythingPaid = expense.splitDetails.every(s => s.isPaid === true);
    if (isEverythingPaid) {
        expense.status = "Settled";
    }

    // 4. Save
    await expense.save();

    if (notiid) {
        await Notification.findByIdAndUpdate(notiid, { isRead: true });
    }

    res.status(200).json({
        success: true,
        message: "Payment confirmed!",
        data: expense
    });
});
