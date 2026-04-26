import { Notification } from "../models/Notification.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("sender", "fullName username avatar")
    .populate("post", "content image")
    .sort({ createdAt: -1 })
    .limit(50);

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched"));
});

const markAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  return res.status(200).json(new ApiResponse(200, {}, "Notifications marked as read"));
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  return res.status(200).json(new ApiResponse(200, { count }, "Unread count fetched"));
});

export { getNotifications, markAsRead, getUnreadCount };
