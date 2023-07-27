import { Types } from "mongoose";

// Notifications Types
type NotiReference =
  | "likes"
  | "Friend_request"
  | "messages"
  | "disLikes"
  | "comments"
  | "shares"
  | "Retweeted"
  | "registered"
  | "follow"
  | "unfollow"
  | "paid";

type IParam = {
  _id: Types.ObjectId;
};

interface INotifications<S> {
  _id?: string[];
  ReceiverId?: S;
  ActionPerformer?: Types.ObjectId;
  NotiId: S;
  Sender: S;
  SendingStatus: boolean;
  NotiReference: NotiReference;
  AlertText: S;
  User: Types.ObjectId;
}

interface Idelete {
  _id: Types.ObjectId;
  NotiId: string;
  SenderId: Types.ObjectId;
  AdminID?: string;
}

interface ICreator {
  Status: string;
  Firstname: string;
  Lastname: string;
  Image: string;
}

interface IHistory<S> {
  ActionPerformer: Types.ObjectId;
  NotiId: S;
  ActionCreator: ICreator;
  NotiReference: NotiReference;
  AlertText: S;
  User: Types.ObjectId;
}

export { INotifications, Idelete, IParam, IHistory, ICreator };
