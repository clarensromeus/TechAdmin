import { Types } from "mongoose";

// Notifications Types
type NotiReference = "paid" | "deleted" | "registered" | "updated";

interface ICreator {
  Status: string;
  Firstname: string;
  Lastname: string;
  Image?: string;
}

interface IHistory<S> {
  ActionPerformer: Types.ObjectId;
  NotiId: S;
  ActionCreator: ICreator;
  NotiReference: NotiReference;
  AlertText: S;
  User: Types.ObjectId;
}

export { ICreator, IHistory };
