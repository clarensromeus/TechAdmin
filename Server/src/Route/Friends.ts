import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import __ from "lodash";
import { FriendsModel, RegisterModelStudent } from "../models/index";
import { IChat, IFriends, IParams, IUnfollow } from "../Interface/Friends";

const Follow = async (req: Request, res: Response) => {
  try {
    const { status, Identifier, User, FriendId }: IFriends = await req.body;

    const docCreate = await FriendsModel.create({
      status,
      FriendId,
      Identifier,
      User,
    });

    if (docCreate) {
      const Getdoc = await FriendsModel.findOne({
        Identifier,
        FriendId,
      }).select("_id  Identifier");
      await RegisterModelStudent.findOneAndUpdate(
        { _id: Getdoc?.Identifier },
        { $push: { Friends: Getdoc?._id } }
      );
      res.status(200).json({ message: "friend is followed", success: true });
    }
  } catch (error) {
    throw new createHttpError[400]();
  }
};

export const GetFriends = async (req: Request<IParams>, res: Response) => {
  // destructure the _id from the params
  const { _id }: IParams = req.params;

  try {
    const doc = await RegisterModelStudent.findOne({
      _id: _id ?? "",
    })
      .select("Friends Chat")
      .populate<{ Chat: IChat<string> }>({
        path: "Chat",
        select: "-ChatId",
        populate: { path: "User", select: "Image" },
      })
      .populate<{
        Friends: IFriends[];
      }>({
        path: "Friends",
        select: "_id identifier  status",
        options: { sort: { createdAt: -1, _id: -1 } },
        populate: {
          path: "User",
          select: "_id Firstname Lastname Image Email",
          populate: {
            path: "Chat",
            match: { Sender: { $eq: `${_id}` } },
            select: "-ChatId",
            populate: { path: "User", select: "Image" },
          },
        },
      });
    if (doc) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    throw new createHttpError.NotFound(`${error}`);
  }
};

const UnFollow = async (
  req: Request<IUnfollow>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, User }: IUnfollow = await req.params;
    // unfollow a friend where _id, FriendId is equal to the friend Identifier
    const doc = await FriendsModel.findOneAndDelete({
      Identifier: _id,
      User,
    });
    // check out if friend is unfollowed
    if (doc) {
      await RegisterModelStudent.findOneAndUpdate({
        $pull: { Friends: doc._id },
      }).where({ _id: doc.User });
      res.status(200).json({ message: "friend is unfollowed", success: true });
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

export { Follow, UnFollow };
