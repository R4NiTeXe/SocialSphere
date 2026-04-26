import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../utils/notification.utils.js";
import mongoose from "mongoose";

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const user = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase().trim(),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "followersList",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "followingList",
      },
    },
    {
      $addFields: {
        followersCount: { $size: "$followers" },
        followingCount: { $size: "$following" },
        isFollowing: {
          $cond: {
            if: { $in: [req.user?._id, "$followers"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        bio: 1,
        followersCount: 1,
        followingCount: 1,
        isFollowing: 1,
      },
    },
  ]);

  if (!user?.length) {
    throw new ApiError(404, "User does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "User profile fetched successfully"));
});

const toggleFollow = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  if (userId.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const userToFollow = await User.findById(userId);
  if (!userToFollow) {
    throw new ApiError(404, "User not found");
  }

  const isFollowing = req.user.following.includes(userId);

  if (isFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: req.user._id },
    });
  } else {
    // Follow
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: req.user._id },
    });

    // Create notification using utility
    await createNotification({
      recipient: userId,
      sender: req.user._id,
      type: "follow",
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isFollowing: !isFollowing },
        isFollowing ? "Unfollowed successfully" : "Followed successfully"
      )
    );
});

const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(200).json(new ApiResponse(200, [], "Empty search"));
  }

  const users = await User.find({
    $or: [
      { username: { $regex: query, $options: "i" } },
      { fullName: { $regex: query, $options: "i" } },
    ],
  }).select("fullName username avatar bio");

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export { getUserProfile, toggleFollow, searchUsers };
