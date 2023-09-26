import nodemailer from "nodemailer";
//import emailTemplate from "./emailTemplate.js";

const senEmailHandler = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    let messageBody = `
                    <p>Your verification code</p>
                    <h3>${otp}</h3>
                    <p>
                        The verification code will be valid for 5 minutes. Please do not share this code with anyone.
                    </p>
                `;
    const message = {
        from: "Olajeks",
        to: email,
        subject: "Email Verification",
        html: messageBody,
    }
    /**sending the mail */
    transporter.sendMail(message).then(info => console.log(`mail, ${info.messageId}, sent to ${email}`)).catch(error => console.log(`error: mail not sent to ${email}`));
}

export default senEmailHandler;