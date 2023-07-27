import { Schema } from "mongoose";
import { Posts } from "../Interface/posts";

export const SchemaPosts = new Schema<Posts<string>>(
  {
    PostId: { type: String, required: true },
    Title: { type: String, required: false, lowercase: true },
    Image: { type: String, required: false, trim: true },
    Retweeted: { type: Boolean, required: false },
    RetweetedPost: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Posts",
    },
    Shared: { type: Boolean, required: false },
    MakerId: { type: String, required: true, trim: true },
    User: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Students",
    },
    Likes: [{ type: Schema.Types.ObjectId, required: false, ref: "Likes" }],
    Comments: [
      { type: Schema.Types.ObjectId, required: false, ref: "Comments" },
    ],
    Retweets: [
      { type: Schema.Types.ObjectId, required: false, ref: "Retweets" },
    ],
  },
  { timestamps: true }
);
