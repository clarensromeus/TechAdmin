import createHttpError from "http-errors";
import { Request, Response } from "express";
import { RegisterModelStudent } from "../models/index";
import __ from "lodash";
import { Multer } from "multer";

export const ChangeProfile = async (req: Request, res: Response) => {
  try {
    // call file multer field on to upload the file
    const image = req.file as Partial<Express.Multer.File>;
    const _id: string = await req.body;
    console.log(_id);

    let Image: string = "";
    const baseUrl = `http://localhost:4000/public/Images/${image.filename}`;
    // if image is not undefined create the image base Url
    if (!__.isUndefined(image.filename)) {
      Image = baseUrl;
    }

    if (typeof _id !== "undefined") {
      const doc = await RegisterModelStudent.findOneAndUpdate({ Image }).where({
        _id,
      });
      res.status(200).json({ success: true, Image: doc?.Image });
    }
  } catch (error) {
    throw new createHttpError[400](`${error}`);
  }
};
