import { model, Types } from "mongoose";
import { ChatSchema } from "../schema/index";

// Chat Types
interface IChat<S> {
  Identifier: Types.ObjectId;
  Sender: Types.ObjectId;
  isSeen: boolean;
  Message?: S;
  PicturedMessage?: S;
  User: Types.ObjectId;
}

const ChatModel = model<IChat<string>>("Chats", ChatSchema);

export default ChatModel;
