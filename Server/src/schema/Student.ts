import { Schema } from "mongoose";
import { IRegister } from "../Interface/Student";

export const SchemaRegister = new Schema<IRegister<string>>({
  _ID_User: { type: String, required: true, trim: true },
  Firstname: {
    type: String,
    required: true,
    trim: true,
  },
  Lastname: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: false,
    trim: true,
  },
  Password: {
    type: String,
    required: true,
    trim: true,
  },
  Username: { type: String, required: false },
  ConfirmPassword: { type: String, required: true, trim: true },
  Image: { type: String, trim: true },
  Class: { type: String, required: false, trim: true },
  ClassName: { type: String, required: false, trim: true },
  SchoolLevel: { type: String, trim: true },
  NoteLevel: { type: Number, required: true },
  isOnline: { type: Boolean, required: true, default: false },
  PersonStatus: { type: String, required: true, default: "Student" },
  DOB: { type: String, required: false },
  Friends: [{ type: Schema.Types.ObjectId, required: false, ref: "Friends" }],
  Chat: [{ type: Schema.Types.ObjectId, required: false, ref: "Chats" }],
  Notifications: [
    { type: Schema.Types.ObjectId, required: false, ref: "Notifications" },
  ],
});
