import { Request, Response } from "express";
import { Types } from "mongoose";
import createHttpError from "http-errors";
// external imports of ressources
import { CommentsModel, PostsModel } from "../models/index";

// Comments Type
interface IComment {
  PostId: string;
  Identifier: string;
  Body: string;
  User: Types.ObjectId;
  Post: Types.ObjectId;
}

interface Iparams {
  _id: Types.ObjectId;
}

const Comments = async (req: Request, res: Response) => {
  try {
    const { PostId, Body, Identifier, User, Post }: IComment = await req.body;

    const docCreate = await CommentsModel.create({
      PostId,
      Identifier,
      Body,
      User,
      Post,
    });
    // if the comment is created store it in the array of comments of the post doc
    if (docCreate) {
      await PostsModel.findOneAndUpdate(
        { Identifier, PostId },
        { $push: { Comments: docCreate._id } }
      );
      res.status(200).json({ message: "comment created", success: true });
    }
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

const GetComments = async (req: Request<Iparams>, res: Response) => {
  try {
    // get specific post by _id
    const { _id }: Iparams = await req.params;
    const doc = await PostsModel.findOne({ _id })
      .select("-Likes -Retweets")
      .populate({ path: "User", select: "Firstname Lastname Image" })
      .populate({
        path: "Comments",
        populate: { path: "User", select: "Firstname Lastname Image" },
      });
    if (doc) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

export { Comments, GetComments };
