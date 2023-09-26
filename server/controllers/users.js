import UserModel from "../models/users.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import createCookies from "../utils/createCookies.js";

/*export const fetchUsers = asyncHandler ( async (req, res) => {
    const users = await UserModel.find({});
    res.status(200).json(users);
})

export const fetchUser = asyncHandler ( async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).select("-password");
    res.status(200).json(user);
})*/

export const updateProfile = asyncHandler ( async (req, res) => {
    const { userId, firstName, lastName, sentAvatar  } = req.body;
    if(!userId){
        res.status(400);
        throw new Error("Resource not found");
    }
    if(!firstName && !lastName && !sentAvatar ){
        res.status(400);
        throw new Error("All form fields cannot be empty.");
    }
    const user = await UserModel.findByIdAndUpdate({_id: userId}, {firstName, lastName, userAvatar: sentAvatar}, { new: true, runValidators: true});
    /**create a cookie with the token */
    createCookies(res, user._id, user.email, user.username, user.confirmed, true, user?.firstName, user?.lastName, user?.userAvatar);
    res.status(200).json({message: "Update successful"});
})

/*export const deleteUser = asyncHandler ( async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findByIdAndDelete(userId);
    res.status(200).json(user);
})*/