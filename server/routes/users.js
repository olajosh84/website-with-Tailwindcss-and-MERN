import express from "express";
import { updateProfile } from "../controllers/users.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

const router = express.Router();

//router.route("/").get(authenticateUser, fetchUsers);
router.route('/updateProfile').patch(authenticateUser, updateProfile);
//router.route("/:userId").get(authenticateUser, fetchUser).delete(authenticateUser, deleteUser);

export default router;