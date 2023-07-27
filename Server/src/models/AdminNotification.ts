import { Types, model } from "mongoose";
import { AdminSchemaNotification } from "../schema";
import { IHistory, ICreator } from "../Interface/Notification";

const AdminNotificationModel = model<IHistory<string>>(
  "History",
  AdminSchemaNotification
);

export default AdminNotificationModel;
