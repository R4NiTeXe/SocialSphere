import path from "path";
import fs from "fs";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const generateAndSaveTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  if (!username || !email || !password || !fullName) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  let avatarLocalPath = "";
  if (req.file) {
    avatarLocalPath = `http://localhost:5000/temp/${req.file.filename}`;
  }

  const user = await User.create({ 
    username, 
    email, 
    password, 
    fullName,
    avatar: avatarLocalPath
  });
  
  const { accessToken, refreshToken } = await generateAndSaveTokens(user._id);
  const newUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, { user: newUser, accessToken }, "Registration successful"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAndSaveTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "Login successful"));
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out"));
});

const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Profile fetched"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, bio } = req.body;
  if (!fullName) throw new ApiError(400, "Name required");

  let updateData = { fullName, bio: bio || "" };

  const files = req.files || {};
  
  // Handle Avatar
  if (files.avatar && files.avatar[0]) {
    if (req.user.avatar && req.user.avatar.includes("localhost:5000/temp/")) {
      const oldFilename = req.user.avatar.split("/").pop();
      const oldPath = path.join("public", "temp", oldFilename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    updateData.avatar = `http://localhost:5000/temp/${files.avatar[0].filename}`;
  }

  // Handle Cover Image
  if (files.coverImage && files.coverImage[0]) {
    if (req.user.coverImage && req.user.coverImage.includes("localhost:5000/temp/")) {
      const oldFilename = req.user.coverImage.split("/").pop();
      const oldPath = path.join("public", "temp", oldFilename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    updateData.coverImage = `http://localhost:5000/temp/${files.coverImage[0].filename}`;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

export { register, login, logout, getMe, updateProfile };
