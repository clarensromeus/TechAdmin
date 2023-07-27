import { Types } from "mongoose";

interface IAdmin<T> {
  username: T;
  password: T;
}

// map through each object key and turn them capitalized
type UpAdmin<T> = {
  [P in keyof T as `${Capitalize<string & P>}`]: T[P];
};

// Register Types
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
  PersonStatus: S;
  Image?: S;
  PromoCode: S;
  StatusLevel: S;
  Notifications?: Types.DocumentArray<INotification>;
}

export default IRegister;
