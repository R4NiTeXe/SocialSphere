import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
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

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: req.user._id },
    });
  } else {

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: req.user._id },
    });


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

const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalPosts = await Post.countDocuments({ owner: userId });
  

  const posts = await Post.find({ owner: userId });
  const totalLikes = posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
  
  const user = await User.findById(userId);
  const totalFollowers = user.followers?.length || 0;
  const totalFollowing = user.following?.length || 0;

  return res.status(200).json(new ApiResponse(200, {
    totalPosts,
    totalLikes,
    totalFollowers,
    totalFollowing,
    engagementRate: totalPosts > 0 ? ((totalLikes / totalPosts).toFixed(1)) : 0
  }, "Stats fetched successfully"));
});

const getUserActivity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const activity = await Post.aggregate([
    {
      $match: {
        owner: userId,
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);


  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = activity.find(a => a._id === dateStr);
    last7Days.push({
      date: date.toLocaleDateString(undefined, { weekday: 'short' }),
      posts: dayData ? dayData.count : 0
    });
  }

  return res.status(200).json(new ApiResponse(200, last7Days, "Activity fetched successfully"));
});

export { getUserProfile, toggleFollow, searchUsers, getUserStats, getUserActivity };
