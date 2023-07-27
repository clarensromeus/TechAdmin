import { Request, Response } from "express";
import createHttpError from "http-errors";
import { RegisterModelStudent } from "../models/index";

const TalentedStudents = async (req: Request, res: Response) => {
  try {
    const NoteLevel: string = req.params?.noteLevel;
    // check if NoteLevel query is not null to proceed on further
    if (typeof NoteLevel !== "object") {
      const db = await RegisterModelStudent.find()
        .select({
          _id: 0,
          Firstname: 1,
          Lastname: 1,
          Image: 1,
          SchoolLevel: 1,
          NoteLevel: 1,
        })
        .sort({ NoteLevel: -1 })
        .limit(3);

      if (db) {
        return res.status(200).json({ Data: db });
      }
    }
  } catch (error) {
    throw new createHttpError.NotFound(`${error}`);
  }
};

export default TalentedStudents;
