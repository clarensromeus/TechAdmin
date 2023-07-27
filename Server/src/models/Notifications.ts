import { model, Types } from "mongoose";
import { NotificationsSchema } from "../schema/index";
import { INotifications } from "../Interface/Notification";

const NotificationsModel = model<Omit<INotifications<string>, "_id">>(
  "Notifications",
  NotificationsSchema
);

export default NotificationsModel;
