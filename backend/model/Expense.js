import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "the title is required"],
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, "the description is required"]
    },
    amount: {
        type: Number,
        min: [0.01, "Amount must be greater than 0"], // Ensure positive value
        required: [true, "Enter the amount"]
    },
    category: {
        type: String,
        enum: ["Housing", "Food", "Utilities", "Transport", "Entertainment", "Groceries", "Health", "Others"],
        default: "Others"
    },
    groupId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    paidBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    splitType: {
        type: String,
        enum: ["equal", "unequal"],
        default: "equal"
    },
    splitDetails: [ 
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            amount: { type: Number, required: [true, "enter the amount"] },
            isPaid: { type: Boolean, default: false },
            status:{type: String, default:"unpaid",enum:["unpaid","paid","settle"]}
        }
    ],
    status: {
        type: String,
        enum: ["Unpaid", "Pending", "Settled"],
        default: "Unpaid"
    },
}, { timestamps: true });

export const Expense = mongoose.model("Expense", ExpenseSchema);
