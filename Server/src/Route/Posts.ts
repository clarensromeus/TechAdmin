import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { Multer } from "multer";
import fs from "fs";
import { join } from "path";
import __ from "lodash";
// internal crafted imports of ressources
import { PostsModel } from "../models/index";
import {
  IDelete,
  IParam,
  IPost,
  IComment,
  ILike,
  IPaginate,
  Iq,
} from "../Interface/posts";

const CreatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Title, PostId, User, MakerId, Retweeted, RetweetedPost }: IPost =
      await req.body;
    // call file multer field on to upload the file
    if (req.file && req.file?.originalname) {
      const OriginalName = (await req.file) as Partial<Express.Multer.File>;
      const Image: string = `http://localhost:4000/public/Images/${OriginalName.filename}`;
      const docCreatedWithImage = await PostsModel.create({
        PostId,
        Title,
        User,
        Image,
        MakerId,
        Retweeted: Boolean(Retweeted),
        RetweetedPost,
      });
      // if post is created display this response
      if (!__.isNil(docCreatedWithImage)) {
        res.status(200).json({ message: "post successfully created" });
      }
    } else {
      // if no image is provided create the post with only text
      const docCreatedWithText = await PostsModel.create({
        PostId,
        Title,
        User,
        MakerId,
        Retweeted: Boolean(Retweeted),
        RetweetedPost,
      });
      // if post is created display this response
      if (!__.isNil(docCreatedWithText)) {
        res
          .status(200)
          .json({ message: "post successfully created", success: true });
      }
    }
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

const GetPosts = async (req: Request<{}, {}, {}, Iq>, res: Response) => {
  try {
    // in case no cursor at the first request is provided
    // catch the most recent _id of the post to initially add it to the cursor
    const FresherPost = await PostsModel.findOne()
      .sort({ _id: -1 })
      .select("_id");
    let cursor: string = await req.query.cursor;
    let limit: number = await parseInt(req.query.limit);

    if (__.isUndefined(cursor) || __.lt(__.size(cursor), 1)) {
      cursor = `${FresherPost?._id}`;
    }

    const doc = await PostsModel.find({
      _id: { $lt: cursor },
    })
      .sort({ _id: -1 })
      .limit(limit)
      .populate({ path: "User", select: "_id Firstname Lastname Image" })
      .populate<{
        Likes: ILike[];
      }>({
        path: "Likes",
        select: "_id Identifier PostId User",
        populate: { path: "User", select: "_id Firstname Lastname" },
      })
      .populate({ path: "Retweets", select: "_id" })
      .populate({
        path: "RetweetedPost",
        select: "-Likes -Comments -_v",
        populate: { path: "User", select: "Image Firstname Lastname" },
      })
      .populate<{
        Likes: IComment[];
      }>({
        path: "Comments",
        select: "_id identifier Body PostId User createdAt",
        populate: {
          path: "User",
          select: "_id Firstname Lastname Image Email Username",
        },
      });

    if (doc.length) {
      let PaginateData: IPaginate[] = [
        {
          hasNext: false,
          lastPost: `${doc[doc.length - 1]._id}`, // first get the last id of the post on which the cursor is
          nextCursor: undefined,
        },
      ];

      let [{ hasNext, lastPost, nextCursor }] = PaginateData;
      // If there is an item with id less than last item (remember, sort is in desc _id), there is a next page
      const result = await PostsModel.findOne({
        _id: { $lt: lastPost },
      });

      if (result) {
        hasNext = true;
      }

      if (hasNext) {
        // if there's next data use it as cursor to fetch next page
        nextCursor = `${doc[doc.length - 1]._id}`;
      }

      res.status(200).json({ doc, nextCursor, cursor });
    }
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

const UserRelatedPosts = async (req: Request<IParam>, res: Response) => {
  try {
    const { _id }: IParam = await req.params;
    // taking all posts by a specific _id
    const doc = await PostsModel.find()
      .where({ MakerId: _id })
      .populate({ path: "User", select: "_id Firstname Lastname Image" })
      .populate({
        path: "RetweetedPost",
        select: "-Likes -Comments -_v",
        populate: { path: "User", select: "Image Firstname Lastname" },
      })
      .populate<{
        Likes: ILike[];
      }>({
        path: "Likes",
        select: "_id Identifier PostId User",
        populate: { path: "User", select: "_id Firstname Lastname" },
      })
      .populate<{
        Likes: IComment[];
      }>({
        path: "Comments",
        select: "_id identifier Body PostId User createdAt",
        populate: {
          path: "User",
          select: "_id Firstname Lastname Image Email Username",
        },
      });
    if (doc) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    throw createHttpError[400](`${error}`);
  }
};

const UpdatePost = async (req: Request, res: Response) => {
  try {
    const { Title, PostId }: Pick<IPost, "Title" | "PostId"> = await req.body;
    // call file multer field on to upload the file
    const image = (await req.file) as Partial<Express.Multer.File>;
    let Image: string = "";
    const baseUrl = `http://localhost:4000/public/Images/${image.filename}`;
    // if image is not undefined create the image base Url
    if (!__.isUndefined(image.filename)) {
      Image = baseUrl;
    }

    if (__.isUndefined(image.filename)) {
      const doc = await PostsModel.findOne({ PostId });
      Image = `${doc?.Image}`;
    }

    const doc = await PostsModel.findOneAndUpdate({ Title, Image }).where({
      PostId,
    });
    if (doc) {
      // if doc is updated display a response back to the client
      res
        .status(200)
        .json({ message: "post updated with success", success: true });
    }
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

const DeletePost = async (req: Request<IDelete>, res: Response) => {
  try {
    // define Customizer
    const Customizer = (value: number, otherValue: number) => {
      return value === otherValue;
    };
    const { _id, PostId, Image }: IDelete = await req.params;

    // retrieving specific image name to delete related to the deleted post
    const MatchedImage = Image.match(/Images\/(?<originalName>[\d]+\.[\w]+)/);

    const doc = await PostsModel.deleteOne({ _id });
    // check if post deleted
    if (doc.acknowledged && __.isEqualWith(doc.deletedCount, 1, Customizer)) {
      // deleted the file on the server for perfomance reason
      fs.unlink(
        join(__dirname, `../../Images/${MatchedImage?.groups?.originalName}`),
        (error) => {
          if (error) {
            throw new Error(`${error}`);
          }
          console.log("file deleted with success");
        }
      );
      res
        .status(200)
        .json({ message: "post deleted with success", success: true });
    }
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};

export { CreatePost, GetPosts, UserRelatedPosts, DeletePost, UpdatePost };
