import { Notification } from "../models/Notification.js";
import { emitToUser } from "../socket.js";

/**
 * Creates a notification in the database and emits it via Socket.io
 */
export const createNotification = async ({ recipient, sender, type, post, comment }) => {
  try {
    // Avoid self-notifications
    if (recipient.toString() === sender.toString()) return null;

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      post,
      comment
    });

    // Populate sender info for the frontend
    const populatedNotification = await Notification.findById(notification._id)
      .populate("sender", "fullName username avatar")
      .populate("post", "content images");

    // Emit to recipient
    emitToUser(recipient, "newNotification", populatedNotification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};
