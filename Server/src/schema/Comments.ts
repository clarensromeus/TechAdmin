import { timeStamp } from "console";
import { Schema, Types } from "mongoose";

// Post Types
interface Comment<S> {
  Identifier: S;
  PostId: S;
  Body: S;
  User: Types.ObjectId;
  Post: Types.ObjectId;
}

export const SchemaComments = new Schema<Comment<string>>(
  {
    Identifier: { type: String, required: true, trim: true },
    PostId: { type: String, required: true },
    Body: {
      type: String,
      required: true,
    },
    Post: { type: Schema.Types.ObjectId, ref: "Posts" },
    User: { type: Schema.Types.ObjectId, ref: "Students" },
  },
  { timestamps: true }
);
