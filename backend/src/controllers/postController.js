import path from "path";
import fs from "fs";
import { Post } from "../models/Post.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../utils/notification.utils.js";

const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  let imagePaths = [];
  if (req.files && req.files.length > 0) {
    imagePaths = req.files.map((file) => `/temp/${file.filename}`);
  }

  const post = await Post.create({
    content,
    images: imagePaths,
    owner: req.user._id,
  });

  const populatedPost = await Post.findById(post._id).populate("owner", "username fullName avatar");

  return res.status(201).json(new ApiResponse(201, populatedPost, "Post created successfully"));
});

const getFeed = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("owner", "username fullName avatar")
    .populate("comments.owner", "username fullName avatar")
    .populate("comments.replies.owner", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, posts, "Feed fetched successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  
  if (!post) throw new ApiError(404, "Post not found");
  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  if (post.images && post.images.length > 0) {
    post.images.forEach((image) => {
      const fullPath = path.join(process.cwd(), "public", image);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });
  }

  await Post.findByIdAndDelete(postId);
  return res.status(200).json(new ApiResponse(200, {}, "Post deleted"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const isLiked = post.likes.includes(req.user._id);
  if (isLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);

    await createNotification({
      recipient: post.owner,
      sender: req.user._id,
      type: "like",
      post: post._id,
    });
  }

  await post.save();
  return res.status(200).json(new ApiResponse(200, { isLiked: !isLiked }, "Toggled like"));
});

const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  if (!content) throw new ApiError(400, "Content required");

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  post.comments.push({ content, owner: req.user._id });
  await post.save();


  await createNotification({
    recipient: post.owner,
    sender: req.user._id,
    type: "comment",
    post: post._id,
  });

  const updated = await Post.findById(postId).populate("comments.owner", "username fullName avatar");
  return res.status(201).json(new ApiResponse(201, updated.comments[updated.comments.length - 1], "Comment added"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const comment = post.comments.id(commentId);
  const isLiked = comment.likes.includes(req.user._id);

  if (isLiked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    comment.likes.push(req.user._id);

    await createNotification({
      recipient: comment.owner,
      sender: req.user._id,
      type: "like",
      post: post._id,
      comment: comment._id,
    });
  }

  await post.save();
  return res.status(200).json(new ApiResponse(200, { isLiked: !isLiked }, "Toggled comment like"));
});

const addCommentReply = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const comment = post.comments.id(commentId);
  comment.replies.push({ content, owner: req.user._id });
  await post.save();


  await createNotification({
    recipient: comment.owner,
    sender: req.user._id,
    type: "reply",
    post: post._id,
    comment: comment._id,
  });

  const updated = await Post.findById(postId).populate("comments.replies.owner", "username fullName avatar");
  const commentRefreshed = updated.comments.id(commentId);
  return res.status(201).json(new ApiResponse(201, commentRefreshed.replies[commentRefreshed.replies.length - 1], "Reply added"));
});

export { createPost, getFeed, deletePost, toggleLike, addComment, toggleCommentLike, addCommentReply };
