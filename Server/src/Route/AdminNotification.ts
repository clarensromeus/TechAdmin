// external imports of ressources
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import createHttpError from "http-errors";
import isNil from "lodash/isNil";
import isEqual from "lodash/isEqual";
// internally crafted imports of ressources
import { AdminNotificationModel, RegisterModelAdmin } from "../models/index";
import {
  IParam,
  INotifications,
  Idelete,
  IHistory,
} from "../Interface/Notification";

const AdminNotifications = async (req: Request, res: Response) => {
  try {
    const {
      ActionPerformer,
      NotiId,
      ActionCreator,
      NotiReference,
      AlertText,
      User,
    }: IHistory<string> = await req.body;

    const doc = await AdminNotificationModel.create({
      ActionPerformer,
      NotiId,
      ActionCreator,
      NotiReference,
      AlertText, // notification text
      User,
    });

    if (!isNil(doc)) {
      // if Notification is created push it to all admins
      await RegisterModelAdmin.find({ $push: { Notifications: doc?._id } });
    }
  } catch (error) {
    createHttpError[400](`${error}`);
  }
};

const AdminGetNotifications = async (req: Request<IParam>, res: Response) => {
  const { _id }: IParam = await req.params;
  try {
    const doc = await AdminNotificationModel.find().populate({
      path: "ActionPerformer",
      select: "Firstname Lastname Image",
    });

    if (!isNil(doc)) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    throw new createHttpError[400]();
  }
};

const AdminDeleteNotifications = async (
  req: Request<Idelete>,
  res: Response
) => {
  try {
    const { _id, NotiId, AdminID }: Idelete = await req.params;

    if (isEqual(AdminID, "64bb0a381e5ce1722e328401")) {
      const doc = await AdminNotificationModel.findOneAndDelete().where({
        NotiId,
      });
      if (!isNil(doc)) {
        // delete the id notification from the destined array of user notifications
        await RegisterModelAdmin.updateMany({
          $pull: { Notifications: _id },
        });
        res.status(200).json({ message: "history deleted with success" });
      }
    } else {
      res.status(200).json({
        message: "sorry, only Admin authorized to delete history",
        success: false,
      });
    }
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

const ClearAllNotifications = async (req: Request, res: Response) => {
  try {
    // clear all the histories
    await AdminNotificationModel.deleteMany({});
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

export {
  AdminNotifications,
  AdminGetNotifications,
  AdminDeleteNotifications,
  ClearAllNotifications,
};
