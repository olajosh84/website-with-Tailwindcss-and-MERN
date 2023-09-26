import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { signIn, signUp, signOut, verifyEmail, verifyOtp, resetPassword, sendMail, confirmUser, userAthentication } from "../controllers/auth.js";
const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/signIn").post(signIn);
router.route("/signOut").post(signOut);
router.route("/verifyEmail").post(verifyEmail);
router.route("/verifyOtp").post(verifyOtp);
router.route("/sendMail").post(sendMail);
router.route("/resetPassword").patch(resetPassword);
router.route("/confirmUser").patch(confirmUser);
router.route('/authenticateUser').get(authenticateUser, userAthentication);

export default router;


