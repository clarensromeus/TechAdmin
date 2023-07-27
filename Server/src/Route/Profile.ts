import { NextFunction, Request, Response } from "express";
import isNil from "lodash/isNil";
import {
  RegisterModelStudent,
  RegisterModelAdmin,
  FriendsModel,
  PostsModel,
} from "../models";
import createHttpError from "http-errors";
import isNill from "lodash/isNil";
import isEqual from "lodash/isEqual";

interface Ip {
  _id: string;
  status: string;
}

const UserProfile = async (
  req: Request<Ip>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, status }: Ip = await req.params;

    const docAdmin = await RegisterModelAdmin.findOne({ _id }).select(
      "Firstname Lastname Image"
    );

    const docStudent = await RegisterModelStudent.findOne({ _id }).select(
      "Firstname Lastname Image"
    );

    if (isEqual(status, "Student") && !isNill(docStudent)) {
      // if doc not equals to null or undefined get its value
      res.status(200).json({ Data: docStudent });
    }

    if (isEqual(status, "Admin") && !isNill(docAdmin)) {
      res.status(200).json({ Data: docAdmin });
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

const UserStats = async (req: Request<{ _id: string }>, res: Response) => {
  try {
    const { _id }: { _id: string } = await req.params;

    const doc = await RegisterModelStudent.findOne({ _id })
      .select("Friends")
      .populate({ path: "Friends" });
    const docFollowing = await FriendsModel.find()
      .where({ User: _id })
      .select("_id");

    const Post = await PostsModel.find({ MakerId: _id }).select("_id");

    if (!isNill(doc) && !isNill(docFollowing) && !isNill(Post))
      res.status(200).json({
        follower: doc?.Friends?.length,
        following: docFollowing.length,
        Post,
      });
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};
export { UserProfile, UserStats };
