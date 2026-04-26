import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getUserProfile, toggleFollow, searchUsers, getUserStats, getUserActivity } from "../controllers/userController.js";

const router = Router();

router.use(verifyJWT);

router.route("/search").get(searchUsers);
router.route("/stats").get(getUserStats);
router.route("/activity").get(getUserActivity);
router.route("/profile/:username").get(getUserProfile);
router.route("/follow/:userId").post(toggleFollow);

export default router;
