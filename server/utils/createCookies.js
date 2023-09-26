import jwt from "jsonwebtoken";

const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 1);

const createCookies =  (res, userId, email, username, confirmed, isLoggedIn, firstName="", lastName="", userAvatar="" ) => {
    try {
        const token = jwt.sign({userId, email, username, confirmed, isLoggedIn, firstName, lastName, userAvatar}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: expiryDate //expires in 
            //maxAge: 3600000 //this is inmilliseconds i.e 1hr
        })
    } catch (error) {
        console.log(error);
    }
}

export default createCookies