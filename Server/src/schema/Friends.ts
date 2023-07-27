import { Schema, Types } from "mongoose";

//Friends Types
interface IFriends<S> {
  status: string;
  FriendId: string;
  Identifier: string;
  User: Types.ObjectId;
}

export const SchemaFriends = new Schema<IFriends<string>>(
  {
    status: { type: String, required: true, trim: true },
    FriendId: { type: String, required: true },
    Identifier: { type: String, required: true },
    User: { type: Schema.Types.ObjectId, ref: "Students" },
  },
  { timestamps: true }
);
