import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getUserProfile, toggleFollow, searchUsers } from "../controllers/userController.js";

const router = Router();

// Secure routes — need login
router.use(verifyJWT);

router.route("/search").get(searchUsers);
router.route("/profile/:username").get(getUserProfile);
router.route("/follow/:userId").post(toggleFollow);

export default router;
