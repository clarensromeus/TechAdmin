import { Request, Response, NextFunction } from "express";
import {
  RegisterModelAdmin,
  RegisterModelStudent,
  RegisterModelTeacher,
} from "../models";

const DashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const docStudent = await RegisterModelStudent.find();
    const docAdmin = await RegisterModelAdmin.find();
    const docTeacher = await RegisterModelTeacher.find();

    res.status(200).json({
      student: docStudent.length, // number of students
      admin: docAdmin.length, // number of administrator
      teacher: docTeacher.length, // number of teacher
    });
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export default DashboardStats;
