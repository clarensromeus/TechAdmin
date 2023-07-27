import { Schema, Types } from "mongoose";
import { INotifications } from "../Interface/Notification";

export const SchemaNotification = new Schema<
  Omit<INotifications<string>, "_id">
>(
  {
    ReceiverId: { type: String, required: false },
    ActionPerformer: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "admin",
    },
    NotiId: { type: String, required: true },
    Sender: { type: String, required: true },
    SendingStatus: { type: Boolean, required: true },
    NotiReference: { type: String, required: true },
    AlertText: { type: String, required: true },
    User: { type: Schema.Types.ObjectId, ref: "Students" },
  },
  { timestamps: true }
);
