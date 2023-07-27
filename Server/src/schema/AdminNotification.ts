import { Schema, Types } from "mongoose";
import { IHistory, ICreator } from "../Interface/Notification";

const ActionCreator = new Schema<ICreator>({
  Status: { type: String, required: true, trim: true },
  Firstname: { type: String, required: true, trim: true },
  Lastname: { type: String, required: true, trim: true },
  Image: { type: String, required: false, trim: true },
});

export const SchemaAdminNotification = new Schema<IHistory<string>>(
  {
    ActionPerformer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "admin",
    },
    NotiId: { type: String, required: true },
    ActionCreator: ActionCreator,
    NotiReference: { type: String, required: true },
    AlertText: { type: String, required: true },
    User: { type: Schema.Types.ObjectId, ref: "admin" },
  },
  { timestamps: true }
);
