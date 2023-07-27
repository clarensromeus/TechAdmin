import { Schema, Types } from "mongoose";

interface IRetweet {
  PostId: string;
  UserRetweetId: Types.ObjectId;
  TweetOwnerId: Types.ObjectId;
}

export const SchemaRetweets = new Schema<IRetweet>(
  {
    PostId: { type: String, required: true, trim: true },
    UserRetweetId: { type: Schema.Types.ObjectId, required: true },
    TweetOwnerId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);
