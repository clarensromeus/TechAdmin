import { Types } from "mongoose";

interface IFriends {
  status: string;
  FriendId: string;
  Identifier: String;
  User: Types.ObjectId;
}

interface IChat<S> {
  Identifier: Types.ObjectId;
  ChatId: S;
  Message: S;
  Sender: Types.ObjectId;
  User: Types.ObjectId;
}

interface IParams {
  _id: string;
}

interface IUnfollow {
  _id: string;
  User: string;
}

export { IFriends, IChat, IParams, IUnfollow };
