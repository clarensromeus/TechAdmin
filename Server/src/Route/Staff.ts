import { Request, Response } from "express";
import createHttpError from "http-errors";
import { RegisterModelAdmin } from "../models/Admin";

const StaffMembers = async (req: Request, res: Response) => {
  try {
    const db = await RegisterModelAdmin.find().select({
      _ConfirmPassword: 0,
      _ID_User: 0,
      __v: 0,
    });
    if (db) {
      return res.status(200).json({ Data: db });
    }
  } catch (error) {
    throw new createHttpError.NotFound(`${error}`);
  }
};

export default StaffMembers;
