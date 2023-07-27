import { Request, Response } from "express";
import createHttpError from "http-errors";
import { RegisterModelStudent } from "../models/index";

export const Suggestion = async (req: Request, res: Response) => {
  try {
    // get all students
    const doc = await RegisterModelStudent.find()
      .select("_id Firstname Lastname Email Image")
      .populate({
        path: "Friends",
        select: "User",
        populate: { path: "User", select: "_id Firstname" },
      });
    if (doc) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

export const SearchingFriends = async (req: Request, res: Response) => {
  try {
    const doc = await RegisterModelStudent.find().where({});
    if (doc) {
      res.status(200).json({ doc });
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};
