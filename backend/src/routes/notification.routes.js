import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getNotifications, markAsRead, getUnreadCount } from "../controllers/notificationController.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getNotifications);
router.route("/mark-read").patch(markAsRead);
router.route("/unread-count").get(getUnreadCount);

export default router;
