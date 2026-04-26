import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { sendMessage, getMessages, getConversations } from "../controllers/chatController.js";

const router = Router();

router.use(verifyJWT);

router.get("/conversations", getConversations);
router.get("/:userToChatId", getMessages);
router.post("/send/:receiverId", sendMessage);

export default router;
