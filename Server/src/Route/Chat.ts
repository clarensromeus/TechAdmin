import { Request, Response } from "express";
import { ChatModel, RegisterModelStudent } from "../models/index";
import createError from "http-errors";
import { Types } from "mongoose";
import __ from "lodash";

// Chat Types
interface IChat<S> {
  ChatId: string;
  Identifier: Types.ObjectId;
  Sender: Types.ObjectId;
  Message: S;
  User: Types.ObjectId;
}

interface IChatbox {
  _id: string[];
}

const Chat = async (req: Request, res: Response) => {
  try {
    const { Identifier, Message, Sender, ChatId, User }: IChat<string> =
      await req.body;

    const docCreate = await ChatModel.create({
      Identifier,
      Message,
      ChatId,
      Sender,
      User,
    });
    if (docCreate) {
      const Getdoc = await ChatModel.findOne({
        Identifier,
        ChatId,
      }).select("_id");

      await RegisterModelStudent.findOneAndUpdate(
        { _id: Identifier },
        { $push: { Chat: Getdoc?._id } }
      );
    }
  } catch (error) {
    throw new createError[400]();
  }
};

const ImageChat = async (req: Request, res: Response) => {
  try {
    const {
      Identifier,
      ChatId,
      Sender,
      User,
    }: Omit<IChat<string>, "Message"> = await req.body;
    // call file multer field on to upload the file
    const image = (await req.file) as Partial<Express.Multer.File>;

    let Image: string = "";
    const baseUrl = `http://localhost:4000/public/Images/${image.filename}`;
    // if image is not undefined create the image base Url
    if (!__.isUndefined(image.filename)) {
      Image = baseUrl;
    }

    const docCreate = await ChatModel.create({
      Identifier,
      PicturedMessage: Image,
      ChatId,
      Sender,
      User,
    });

    if (docCreate) {
      const Getdoc = await ChatModel.findOne({
        Identifier,
        ChatId,
      }).select("_id");

      await RegisterModelStudent.findOneAndUpdate(
        { _id: Identifier },
        { $push: { Chat: Getdoc?._id } }
      );

      res
        .status(200)
        .json({ message: "image sent with success", success: true });
    }
  } catch (error) {
    throw new createError[400](`${error}`);
  }
};

const isSeenMessages = async (req: Request, res: Response) => {
  try {
    const { _id }: IChatbox = await req.body;
    // update messages we already got so that next time they not show up on the user chat box
    // and showing only new messages
    const doc = await ChatModel.updateMany({ isSeen: true }).where({
      _id: { $in: _id },
    });
    if (doc) {
      res.status(200).json({ message: "chat is modified", success: true });
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export { Chat, ImageChat, isSeenMessages };
