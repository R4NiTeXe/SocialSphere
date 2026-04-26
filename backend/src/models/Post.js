import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Post content cannot be empty"],
      trim: true,
    },
    image: {
      type: String, // URL of the image (local path for now)
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        likes: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          }
        ],
        replies: [
          {
            content: String,
            owner: {
              type: Schema.Types.ObjectId,
              ref: "User"
            },
            createdAt: {
              type: Date,
              default: Date.now,
            }
          }
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
