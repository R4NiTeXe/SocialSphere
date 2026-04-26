import { Notification } from "../models/Notification.js";
import { emitToUser } from "../socket.js";


export const createNotification = async ({ recipient, sender, type, post, comment }) => {
  try {

    if (recipient.toString() === sender.toString()) return null;

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      post,
      comment
    });


    const populatedNotification = await Notification.findById(notification._id)
      .populate("sender", "fullName username avatar")
      .populate("post", "content images");


    emitToUser(recipient, "newNotification", populatedNotification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};
