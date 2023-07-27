import { Request, Response } from "express";
import { Types } from "mongoose";
import { LikesModel, PostsModel } from "../models/index";
import createHttpError from "http-errors";

//Like Types
type IPreference = "likes" | "dislikes";

interface ILike {
  _id?: Types.ObjectId;
  PostId: string;
  Preference?: IPreference;
  Identifier: string;
  User: Types.ObjectId;
  Post: Types.ObjectId;
}

const Likes = async (req: Request, res: Response) => {
  try {
    const { _id, PostId, Preference, Identifier, User, Post } = await req.body;
    const doc = await LikesModel.findOne({ Identifier, PostId });

    if (doc) {
      await LikesModel.deleteOne({ Identifier, PostId });
      // if user already like the post delete it for perfect dislike performance
      await PostsModel.findOneAndUpdate(
        { Identifier, PostId },
        { $pull: { Likes: doc._id } }
      );
      res.status(200).json({ message: "unlike the post", success: true });
    } else {
      const docCreate = await LikesModel.create({
        PostId,
        Identifier,
        Preference,
        User,
        Post,
      });

      if (docCreate) {
        // add the like to the post if user doesn't
        await PostsModel.findOneAndUpdate(
          { Identifier, PostId },
          { $push: { Likes: docCreate?._id } }
        );
        res.status(200).json({ message: "ike the post", success: true });
      }
    }
  } catch (error) {
    throw new createHttpError[400]();
  }
};

export { Likes };
