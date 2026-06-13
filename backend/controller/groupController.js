import Group from "../model/Group.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createGroup = asyncHandler(async (req, res) => {

    const admin = req.user._id;
    const { name, members } = req.body;

    const existing = await Group.findOne({ name, admin });

    if (existing) {
        return res.status(400).json({
            success: false,
            message: "You already have a group with this name."
        });
    }

    // ✅ convert members to IDs
    const memberIds = members.map((m) =>
        typeof m === "object" ? m._id : m
    );

    // ✅ remove admin if exists
    const filteredMembers = memberIds.filter(
        (id) => id.toString() !== admin.toString()
    );

    const group = await Group.create({
        name,
        admin,
        members: [...filteredMembers, admin]
    });

    res.status(201).json({
        success: true,
        data: group,
    });
});
export const joinGroup =asyncHandler(async(req,res)=>{
    const {code} = req.body;
    if(!code){
        return res.status.json({
            success:false,
            message:"code not found"
        })
    }
    const group = await Group.findOne({code});
    if(!group){
        return res.status(404).json({
            success:false,
            message:"Invalid code"
        });
    }
    
    if (group.members.includes(req.user._id)) {
        return res.status(404).json({
            success: false,
            message: "You are already a member of this group"
        });
    }
    const updatedgroup = await Group.findOneAndUpdate({code:code},{$addToSet:{members:req.user._id}},{new:true});
    res.status(200).json({
        success:true,
        data:updatedgroup
    });

});

export const getmembers =asyncHandler(async(req,res)=>{
    console.log(req.user);
    const groups = await Group.find({members:req.user._id});
    if(!groups){
        return res.status.json({
            success:false,
            message:"No Groups exist"
        });
    }
    res.status(200).json({
        success:true,
        data:groups
    });
})

export const getgroup =asyncHandler(async(req,res)=>{
    const group = await Group.findById(req.params.grpid).populate("admin",'name email').populate("members","name email");
    if(!group)
    {
        return res.status(404).json({
            success:false,
            message:"The Group not found"
        });
    }
    return res.status(200).json({
        success:true,
        data:group
    });

})

export const deletegroup = asyncHandler(async(req,res)=>{
    const group = await Group.findByIdAndDelete(req.params.grpid);
    if (!group) {
        return res.status(404).json({
            success: false,
            message: "The Group not found"
        });
    }
    return res.status(200).json({
        success: true,
        message:"The group is deleted successfully"
    });
})


