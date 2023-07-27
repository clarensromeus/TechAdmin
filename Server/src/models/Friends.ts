import { Types, model } from "mongoose";
import { FriendsSchema } from "../schema/index";

//Friends Types
interface IFriends<S> {
  status: S;
  FriendId: S;
  Identifier: S;
  User: Types.ObjectId;
}

const FriendsModel = model<IFriends<string>>("Friends", FriendsSchema);

export default FriendsModel;
