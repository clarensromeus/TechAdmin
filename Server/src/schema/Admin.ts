import { Schema, Types } from "mongoose";
import IRegister from "../Interface/Admin";

// Register Schema
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
  PersonStatus: { type: String, required: true, default: "Admin" },
  ConfirmPassword: { type: String, required: true, trim: true },
  Image: { type: String, trim: true },
  PromoCode: { type: String, trim: true, required: true },
  StatusLevel: { type: String, trim: true, required: true },
  Notifications: [
    { type: Schema.Types.ObjectId, ref: "AdminNotifications", required: false },
  ],
});
