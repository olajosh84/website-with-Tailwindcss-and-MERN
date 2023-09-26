import UserModel from "../models/users.js";
import OTPModel from "../models/otp.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import OTPGenerator from "otp-generator";
import sendEmailHandler from "../utils/sendEmailHandler.js";
import createCookies from "../utils/createCookies.js";

/**register function */
export const signUp = asyncHandler(async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;
    if(!email || !password || !username || !confirmPassword){
        res.status(400);
        throw new Error("All form fields are required");
    }else{
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(username.length < 4){
            res.status(400);
            throw new Error("Username must be at least 4 characters long");
        } 
        if(username.length > 15){
            res.status(400);
            throw new Error("Username must not exceed 15 characters");
        } 
        if(!email.match(mailformat)){
            res.status(400);
            throw new Error("Please provide a valid email address")
        }
        if(password.length < 8){
            res.status(400);
            throw new Error("Password must have a minimum of 8 characters")
        }
        if(password !== confirmPassword){
             res.status(400);
             throw new Error("Passwords do not match");
        } 
    }
    /** check for uniqueness of username and email before saving in the database */
    const userExist = await UserModel.findOne({username});
    const emailExist = await UserModel.findOne({email});
    if(userExist || emailExist){
        res.status(400);
        throw new Error("Username or email already exists");
    }
    /**generate otp */
    const otp = OTPGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    /**save otp to database */
    await OTPModel.create({email, otp});
    /**send email */
    sendEmailHandler(email, otp); //send mail to newly registered user
    /**save user info */
    const user = await UserModel.create({email, username, password});
    /**create cookies */
    createCookies(res, user._id, user.email, user.username, user.confirmed, false);
    res.status(200).json({message: "Registration successful"});
});

/**login function */
export const signIn = asyncHandler( async (req, res) => {
    const { username, password }  = req.body;
    /**check for empty fields */
    if(!username || !password) {
        res.status(400);
        throw new Error("All form fields are required");
    }
    const user = await UserModel.findOne({ username });
    if(!user){
        res.status(400);
        throw new Error("Username or password is incorrect");
    }
    /**check if entered password matches saved password */
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch){
        res.status(400);
        throw new Error("Username or password is incorrect");
    }
    /**checking if the user is confirmed even if he exists in the database i.e he is registered */
    if(!user.confirmed){
        /**create a cookie with the token */
        createCookies(res, user._id, user.email, user.username, user.confirmed, false);
        res.status(401).json({message: "You have yet to confirm your email"});
        return;
    }
    /**create a cookie with the token */
    createCookies(res, user._id, user.email, user.username, user.confirmed, true, user?.firstName, user?.lastName, user?.userAvatar);
    res.status(200).json({message: "Login successful"});
})

/**logout function */
export const signOut = asyncHandler ( async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message: "Logout successful"});
})

/**verify email function */
export const verifyEmail = asyncHandler ( async (req, res) => {
    const { userEmail } = req.body; 
    /**checking if email is not empty and is valid */
    if(!userEmail) {
        res.status(400);
        throw new Error("Please enter your email address"); 
    }else{
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!userEmail.match(mailformat)){
            res.status(400);
            throw new Error("Please enter a valid email address"); 
        }
    }
    const user = await UserModel.findOne({email: userEmail});
    /**checking if email exists */
    if(!user){
        res.status(400);
        throw new Error("Incorrect email address"); 
    }
    /**creating otp and sending email to user */
    /**generate otp */
    const otp = OTPGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    /**save otp to database */
    await OTPModel.create({email: userEmail, otp});
    /**send email */
    sendEmailHandler(userEmail, otp);
    res.status(200).json({message: "otp sent to your email address"});
})

/**OTP verification function */
export const verifyOtp = asyncHandler ( async (req, res) => {
    const { userEmail, otp } = req.body;
    if(!userEmail || !otp){
        res.status(400);
        throw new Error("Please enter otp");
    }
    /** checking if the user's email and exist  */
    const savedInfo = await OTPModel.findOne({email: userEmail, otp});
    if(!savedInfo){
        res.status(400);
        throw new Error("invalid or expired otp");
    }
    res.status(200).json({message: "Email verified successfully"});
})

/**password rest function */
export const resetPassword = asyncHandler ( async (req, res) => {
    const { password, confirmPassword, userEmail } = req.body;
    /**checking if passwords are empty */
    if(!password || !confirmPassword || !userEmail){
        res.status(400);
        throw new Error("All form fields are required");
    }
    if(password.length < 8){
        res.status(400);
        throw new Error("Password must have a minimum of 8 characters")
    }
    if(password !== confirmPassword){
         res.status(400);
         throw new Error("Passwords do not match");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await UserModel.findOneAndUpdate({email: userEmail}, {password: hashedPassword});
    res.status(200).json({message: "Password reset successful"});
})

/**send email function */
export const sendMail = asyncHandler ( async (req, res) => {
    const { userEmail } = req.body;
    /**checking if email is not empty and is valid */
    if(!userEmail) {
        res.status(400);
        throw new Error("Please enter your email address"); 
    }else{
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!userEmail.match(mailformat)){
            res.status(400);
            throw new Error("Please enter a valid email address"); 
        }
    }
    /**generate otp */
    const otp = OTPGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    /**save otp to database */
    await OTPModel.create({email: userEmail, otp});
    /**send email */
    sendEmailHandler(userEmail, otp);
    res.status(200).json({message: "OTP sent to your email address"});
})

/**user confirmation function */
export const confirmUser = asyncHandler ( async (req, res) => {
    const { userEmail } = req.body;
     /**checking if email is not empty and is valid */
     if(!userEmail) {
        res.status(400);
        throw new Error("Please enter your email address"); 
    }else{
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!userEmail.match(mailformat)){
            res.status(400);
            throw new Error("Please enter a valid email address"); 
        }
    }
    const user = await UserModel.findOneAndUpdate({email: userEmail}, {confirmed: true});
    createCookies(res, user._id, user.email, user.username, user.confirmed, false);
    res.status(200).json({success: "true"});
})

/**Authenticate user */
export const userAthentication = asyncHandler ( async (req, res) => {
    const {userId, email, username, confirmed, isLoggedIn, firstName, lastName, userAvatar} = req.user;
    let sessionInfo = {userId, email, username, confirmed, isLoggedIn, firstName, lastName, userAvatar}
    res.status(200).json({success: true, sessionInfo, message: "user authenticated"});
})

