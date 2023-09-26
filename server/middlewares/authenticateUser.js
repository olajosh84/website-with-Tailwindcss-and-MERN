import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";

const authenticateUser = asyncHandler ( async (req, res, next) => {
    const token = req.cookies.token;
    if(token){
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next()
        } catch (error) {
            //res.status(401).json({status: "expired token"});
            throw new Error("Access Denied");
        }
    }else{
        res.status(401);
        throw new Error("Access Denied");
    }
})

export { authenticateUser };