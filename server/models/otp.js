import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    otp: String,
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: 300,
    }
},{timestamps: true});
/**hash OTP before saving */
/*OTPSchema.pre("save", async function(next){
    if(this.isNew){
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
    }
    next();
})*/
const OTPModel = mongoose.model("OTP", OTPSchema);
export default OTPModel;