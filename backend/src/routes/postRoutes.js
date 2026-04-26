import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multerMiddleware.js";
import { createPost, getFeed, deletePost, toggleLike, addComment } from "../controllers/postController.js";

const router = Router();

// All post routes require authentication
router.use(verifyJWT);

router.route("/")
  .get(getFeed)
  .post(upload.single("image"), createPost);

router.route("/:postId")
  .delete(deletePost);

router.route("/:postId/like")
  .post(toggleLike);

router.route("/:postId/comments")
  .post(addComment);

router.route("/:postId/comments/:commentId/like")
  .post(toggleCommentLike);

router.route("/:postId/comments/:commentId/replies")
  .post(addCommentReply);

export default router;
