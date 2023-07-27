// external imports of ressources
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import createHttpError from "http-errors";
import __ from "lodash";
// internally crafted imports of ressources
import { NotificationsModel, RegisterModelStudent } from "../models/index";
import { IParam, INotifications, Idelete } from "../Interface/Notification";

const Notifications = async (req: Request, res: Response) => {
  try {
    const {
      _id, // users ids for pushing multiple notifications
      ReceiverId,
      NotiId,
      Sender,
      SendingStatus,
      NotiReference,
      AlertText,
      User,
    }: INotifications<string> = await req.body;

    const doc = await NotificationsModel.create({
      ReceiverId,
      NotiId,
      Sender, // sender Id
      SendingStatus, // notification status
      NotiReference,
      AlertText, // notification text
      User,
    });

    if (doc) {
      const Getdoc = await NotificationsModel.findOne({
        ReceiverId,
        NotiId,
      }).select("_id");

      if (typeof _id !== undefined && !__.isEmpty(_id)) {
        // if Notification is created push it to the concerned users
        await RegisterModelStudent.updateMany(
          { _id: { $in: _id } },
          { $push: { Notifications: Getdoc?._id } }
        );
      } else {
        // if Notification is created push it to the concerned user
        await RegisterModelStudent.findOneAndUpdate(
          { _id: ReceiverId },
          { $push: { Notifications: Getdoc?._id } }
        );
      }
    }
  } catch (error) {
    throw createHttpError[400];
  }
};

const GetNotifications = async (
  req: Request<IParam>,
  res: Response,
  next: NextFunction
) => {
  const { _id }: IParam = await req.params;
  try {
    const doc = await RegisterModelStudent.findOne()
      .where({ _id })
      .select("Notifications")
      .populate<{ Notifications: INotifications<string> }>({
        path: "Notifications",
        select: "-_v -updatedAt",
        populate: { path: "User", select: "_id Firstname Lastname Image" },
      });

    if (doc) {
      res.status(200).json({ doc });
    }

    next();
  } catch (error) {
    throw new createHttpError[400]();
  }
};

const DeleteNotifications = async (req: Request<Idelete>, res: Response) => {
  try {
    const { _id, NotiId, SenderId }: Idelete = await req.params;

    const doc = await NotificationsModel.findOneAndDelete().where({
      _id,
      NotiId,
    });
    if (doc) {
      // delete the id notification from the destined array of user notifications
      await RegisterModelStudent.findOneAndUpdate({
        $pull: { Notifications: _id },
      }).where({ _id: SenderId });
    }
  } catch (error) {
    throw new createHttpError[400]();
  }
};

export { Notifications, GetNotifications, DeleteNotifications };
