import { Router } from "express";
import { register, login, logout, getMe, updateProfile } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// These routes need a valid login session
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getMe);
router.patch("/update-profile", verifyJWT, updateProfile);

export default router;
