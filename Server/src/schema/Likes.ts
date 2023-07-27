import { Schema, Types } from "mongoose";

//Like Types
type IPreference = "Like" | "dislike";

interface ILike {
  PostId: string;
  Identifier: string;
  Preference?: IPreference;
  User: Types.ObjectId;
  Post: Types.ObjectId;
}

export const SchemaLikes = new Schema<ILike>(
  {
    PostId: { type: String, required: true },
    Identifier: { type: String, required: true },
    Preference: { type: String, required: true },
    User: { type: Schema.Types.ObjectId, ref: "Students" },
    Post: { type: Schema.Types.ObjectId, ref: "Posts" },
  },
  { timestamps: true }
);
