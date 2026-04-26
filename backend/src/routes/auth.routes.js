import { Router } from "express";
import { register, login, logout, getMe, updateProfile } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);

router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getMe);
router.patch("/update-profile", verifyJWT, upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), updateProfile);

export default router;
