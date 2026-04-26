import path from "path";
import fs from "fs";
import { Post } from "../models/Post.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required to create a post");
  }

  // Get image path if file was uploaded
  let imagePath = "";
  if (req.file) {
    imagePath = `/temp/${req.file.filename}`;
  }

  const post = await Post.create({
    content,
    image: imagePath,
    owner: req.user._id,
  });

  if (!post) {
    throw new ApiError(500, "Something went wrong while creating the post");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

const getFeed = asyncHandler(async (req, res) => {
  // Simple feed: get all posts, sorted by newest
  const posts = await Post.find()
    .populate("owner", "username fullName avatar")
    .populate("comments.owner", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Feed fetched successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the user is the owner
  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    // Unlike
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    // Like
    post.likes.push(userId);
  }

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: !isLiked }, "Post like toggled"));
});

const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const newComment = {
    content,
    owner: req.user._id,
  };

  post.comments.push(newComment);
  await post.save();

  // Populate the owner of the new comment for the frontend
  const updatedPost = await Post.findById(postId).populate("comments.owner", "username fullName avatar");
  const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

  return res
    .status(201)
    .json(new ApiResponse(201, addedComment, "Comment added successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const comment = post.comments.id(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  const isLiked = comment.likes.includes(userId);

  if (isLiked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    comment.likes.push(userId);
  }

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: !isLiked }, "Comment like toggled"));
});

const addCommentReply = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Reply content is required");

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const comment = post.comments.id(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  const reply = {
    content,
    owner: req.user._id,
  };

  comment.replies.push(reply);
  await post.save();

  // Populate to send back the full reply with user info
  const updatedPost = await Post.findById(postId).populate("comments.replies.owner", "username fullName avatar");
  const updatedComment = updatedPost.comments.id(commentId);
  const newReply = updatedComment.replies[updatedComment.replies.length - 1];

  return res
    .status(201)
    .json(new ApiResponse(201, newReply, "Reply added successfully"));
});

export { createPost, getFeed, deletePost, toggleLike, addComment, toggleCommentLike, addCommentReply };
