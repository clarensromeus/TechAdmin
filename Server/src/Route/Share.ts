import { Request, Response } from "express";
import { ChatModel, RegisterModelStudent } from "../models/index";
import { Types } from "mongoose";
import createHttpError from "http-errors";

interface IShare {
  _id: string[];
  Identifier: Types.ObjectId;
  ChatId: string;
  PicturedMessage: string;
  Message: string;
  Sender: string;
  User: Types.ObjectId;
}

const Share = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      Identifier,
      ChatId,
      PicturedMessage,
      Message,
      Sender,
      User,
    }: IShare = await req.body;

    const doc = await ChatModel.create({
      Identifier, // message Receiver id
      ChatId, // id of the chat generating by nanoid
      PicturedMessage, // picture of the shared post
      Message, // post title or message
      Sender, // post sender id
      User,
    });

    if (doc) {
      const Getdoc = await ChatModel.findOne({
        Identifier: doc.Identifier,
        ChatId,
      });
      await RegisterModelStudent.updateMany(
        { _id: { $in: _id } },
        { $push: { Chat: Getdoc?._id } }
      );
    }
    res.status(200).json({ message: "shared successfully" });
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

export { Share };
