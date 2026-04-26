import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Cookie settings — httpOnly so JavaScript can't touch them (protects against XSS)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// Helper to generate both tokens and save the refresh token to the database
const generateAndSaveTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  if (!username || !email || !password || !fullName) {
    throw new ApiError(400, "Please fill in all the fields");
  }

  // Make sure no one else has already taken this email or username
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(
      409,
      "An account with this email or username already exists"
    );
  }

  const user = await User.create({ username, email, password, fullName });

  const { accessToken, refreshToken } = await generateAndSaveTokens(user._id);

  // Don't send the password or refresh token back to the client
  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: newUser, accessToken },
        "Welcome to SocialSphere!"
      )
    );
});

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "No account found with that email");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Wrong password — please try again");
  }

  const { accessToken, refreshToken } = await generateAndSaveTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "Welcome back!"
      )
    );
});

// POST /api/v1/auth/logout  (requires login)
const logout = asyncHandler(async (req, res) => {
  // Remove the refresh token from the database so the session is truly invalidated
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "You have been logged out"));
});

// GET /api/v1/auth/me  (requires login)
const getMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, bio } = req.body;

  if (!fullName) {
    throw new ApiError(400, "Full name is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        bio: bio || "",
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

export { register, login, logout, getMe, updateProfile };
