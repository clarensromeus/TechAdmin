import { Request, Response } from "express";
import { RegisterModelStudent } from "../models/index";
import createHttpError from "http-errors";
import { Types } from "mongoose";

interface IOnline {
  isOnline: boolean;
  _id: Types.ObjectId;
}

const isOnline = async (req: Request, res: Response) => {
  try {
    const { isOnline, _id }: IOnline = await req.body;
    // asyncronously change isOnline status in student model
    await RegisterModelStudent.findOneAndUpdate({ isOnline }).where({
      _id,
    });
  } catch (error) {
    createHttpError[400](`${error}`);
  }
};

export default isOnline;
