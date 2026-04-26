import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitToUser } from "../socket.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { receiverId } = req.params;
  const senderId = req.user._id;

  if (!content) throw new ApiError(400, "Content is required");


  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
  });

  if (newMessage) {
    conversation.lastMessage = newMessage._id;
    await conversation.save();
  }


  emitToUser(receiverId, "newMessage", newMessage);

  return res.status(201).json(new ApiResponse(201, newMessage, "Message sent"));
});

const getMessages = asyncHandler(async (req, res) => {
  const { userToChatId } = req.params;
  const senderId = req.user._id;

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, userToChatId] },
  });

  if (!conversation) {
    return res.status(200).json(new ApiResponse(200, [], "No conversation yet"));
  }

  const messages = await Message.find({
    $or: [
      { sender: senderId, receiver: userToChatId },
      { sender: userToChatId, receiver: senderId },
    ],
  }).sort({ createdAt: 1 });

  return res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
});

const getConversations = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const conversations = await Conversation.find({
    participants: { $in: [loggedInUserId] },
  })
    .populate("participants", "username fullName avatar")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });


  const filteredConversations = conversations.map((conv) => {
    const otherParticipant = conv.participants.find(
      (p) => p._id.toString() !== loggedInUserId.toString()
    );
    return {
      ...conv._doc,
      otherParticipant,
    };
  });

  return res.status(200).json(new ApiResponse(200, filteredConversations, "Conversations fetched"));
});

export { sendMessage, getMessages, getConversations };
