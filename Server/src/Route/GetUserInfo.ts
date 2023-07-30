import { Request, Response, NextFunction } from "express";
import { RegisterModelStudent, RegisterModelAdmin } from "../models";
import isNil from "lodash/isNil";

type UserInfo = {
  _id: string;
  status: string;
};

const GetUserInfo = async (
  req: Request<UserInfo>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, status }: UserInfo = await req.params;

    if (status === "Student") {
      // if authentication is made by a student retrieve student-only data
      const student = await RegisterModelStudent.findOne({ _id }).select(
        "-Notifications -Friends -Chat"
      );
      if (!isNil(student)) {
        res.status(200).json({ Data: student });
        next();
      }
    } else {
      // if authentication is made by an administrator retrieve administrator-only data
      const admin = await RegisterModelAdmin.findOne({ _id });
      if (!isNil(admin)) {
        res.status(200).json({ Data: admin });
        next();
      }
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export default GetUserInfo;
