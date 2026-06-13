// 1. Fixed whoOwnswhom: Fetch expenses ONCE to avoid duplicate math
import { Expense } from "../model/Expense.js";
import Group from "../model/Group.js";
import { Notification } from "../model/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";

const createnoti= asyncHandler(async(req,expense)=>{
    const recipient =expense.paidBy;
    console.log(expense.paidBy.name);
    const sender = req.user._id;
    const message =`${req.user.name} has marked ${expense.title} as paid . Please confirm to settle.`
    try{
        const notification = await Notification.create({
            recipient, sender, message
        });
    }
    catch (err) {
        if (err.code === 11000) {
            return 'you have already send request';
        }
        throw err;
    }
   
    
})
export const whoOwnswhom = asyncHandler(async (req, res) => {
    let scoreboard = {};
    const group = await Group.findById(req.params.grpid);
    if (!group) return res.status(404).json({ message: "Group not found" });
    group.members.forEach(m => scoreboard[m._id.toString()] = 0);
    const allExpenses = await Expense.find({
        groupId: req.params.grpid,
        status: { $ne: "Settled" }
    });

    allExpenses.forEach(bill => {
        const payerId = bill.paidBy.toString();
        scoreboard[payerId] += bill.amount;
        bill.splitDetails.forEach(split => {
            const memberId = split.userId.toString();
            if (scoreboard.hasOwnProperty(memberId)) {
                scoreboard[memberId] -= split.amount;
            }
        });
    });

    res.json({ success: true, data: scoreboard });
});
export const updatesettle = asyncHandler(async (req, res) => {
    let expense = await Expense.findById(req.params.expid).populate('paidBy','name','splitDetails');
    if (!expense) return res.status(404).json({ success: false, message: "Expense not Found." });
    const userSplit = expense.splitDetails.find(
        (s) => s.userId.toString() === req.user._id.toString()
    );
    console.log(req.user);
    console.log(expense);
    if (req.user._id.toString() === expense.paidBy.toString()|| userSplit &&userSplit.isPaid) {
        return res.status(403).json({
            success: false,
            message: "You Cannot update the settle."
        });
    }
    const updated = await Expense.findByIdAndUpdate(
        req.params.expid,
        { status: "Pending"}, 
        {  returnDocument: 'after' }

    );
    try{
        await createnoti(req,expense);
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:err.message||'the notifications has been already sended'
        })
    }
    res.status(200).json({
        success:true,
        message:"the Notification has been sended successfully"
    })
});
export const activity = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ groupId: req.params.grpid })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('paidBy', 'name');
    if (expenses.length === 0) {
        return res.status(200).json({ success: true, message: "No activity yet.", data: [] });
    }
    res.json({ success: true, data: expenses });
});

