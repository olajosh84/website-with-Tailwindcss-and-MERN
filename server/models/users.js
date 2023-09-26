import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Please enter a username"],
        minlength: [4, "Username must have minimum of 4 characters"],
        maxlength: [15, "Username must not exceed 15 characters"],
        unique: [true, "Username already exists"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true,
        minlength: [8, "Password must contain 8 characters or more"],
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Please provide an email address"],
        unique: [true, "Email address already exists"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    userAvatar: String,
    role: String,
}, {timestamps: true});

/**encrypt password before it is saved */
userSchema.pre("save", async function(next) {
    if(this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
})
/**check if password entered matches the one in database 
userSchema.methods.passwordsMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
   
}*/
/**create a jwt using instance method 
userSchema.methods.createJWT = async function () {
    const token = await jwt.sign(
        { userId: this._id, username: this.username},
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    )
    return token;
}
*/

const UserModel = mongoose.model("User", userSchema);
export default UserModel;