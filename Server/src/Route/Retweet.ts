import { Request, Response } from "express";
import { Types } from "mongoose";
import { RetweetModel, PostsModel } from "../models/index";
import createHttpError from "http-errors";

interface IRetweet {
  _id: Types.ObjectId; // id of the post that is retweeted
  PostId: string;
  UserRetweetId: Types.ObjectId; // is the user id who retweets the post
  TweetOwnerId: Types.ObjectId; // user to whom tweeted post is belonged
}

const Retweet = async (req: Request, res: Response) => {
  try {
    const { _id, UserRetweetId, TweetOwnerId, PostId }: IRetweet =
      await req.body;
    const doc = await RetweetModel.create({
      PostId,
      UserRetweetId,
      TweetOwnerId,
    });
    if (doc) {
      // if the post is retweeted add it to the relevant user post
      await PostsModel.findOneAndUpdate(
        { _id, PostId },
        { $push: { Retweets: doc?._id } }
      );
      res
        .status(200)
        .json({ message: "successfully retweeted", success: true });
    }
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

export default Retweet;
