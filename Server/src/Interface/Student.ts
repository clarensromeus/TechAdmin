import { Types } from "mongoose";

interface IFriends {
  _id: Types.ObjectId;
}

interface IChat {
  _id: Types.ObjectId;
}

interface INotification {
  _id: Types.ObjectId;
}

interface IRegister<S> {
  _ID_User: string;
  Firstname: S;
  Lastname: S;
  Email?: S;
  Password: S;
  ConfirmPassword: S;
  Username?: S;
  Image?: S;
  Class: S;
  ClassName?: S;
  SchoolLevel: S;
  NoteLevel: number;
  isOnline: boolean;
  PersonStatus: S;
  DOB: string;
  Friends: Types.DocumentArray<IFriends>;
  Chat: Types.DocumentArray<IChat>;
  Notifications: Types.DocumentArray<INotification>;
}

interface IMail {
  DESTINATION: string;
  SUBJECT: string;
  HTMLBODY: string;
  MESSAGE: string;
}

export { IRegister, IMail };
