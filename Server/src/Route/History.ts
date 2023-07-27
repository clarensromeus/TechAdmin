import { Request, Response, NextFunction } from "express";
import __ from "lodash";
import createHttpError from "http-errors";
// externally crafted imports of ressources
import { NotificationsModel } from "../models";

const History = async (req: Request, res: Response) => {
  try {
    // retrieve only notifications with NotiSenderStatus field labeled Admin
    const doc = await NotificationsModel.find().where({
      NotiSenderStatus: "Admin",
    });

    if (doc) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    throw createHttpError[400]();
  }
};

export default History;

// a special route handler is to get for authorized admins nofified about some actions made by sudents
// in th application such as a new registered ,paid  and deleted student
// and more...
