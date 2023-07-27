import { Schema, Types } from "mongoose";

// Chat Types
interface IChat<S> {
  Identifier: Types.ObjectId;
  ChatId: S;
  Message?: S;
  PicturedMessage?: S;
  Sender: Types.ObjectId;
  isSeen: boolean;
  User: Types.ObjectId;
}

export const SchemaChats = new Schema<IChat<string>>(
  {
    Identifier: { type: Schema.Types.ObjectId, required: true },
    Sender: { type: Schema.Types.ObjectId, required: true },
    isSeen: { type: Boolean, required: true, default: false },
    ChatId: { type: String, required: true, trim: true },
    Message: { type: String, required: false, trim: true },
    PicturedMessage: { type: String, required: false, trim: true },
    User: { type: Schema.Types.ObjectId, ref: "Students" },
  },
  { timestamps: true }
);
