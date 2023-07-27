import { Request, Response } from "express";
import createHttpError from "http-errors";
import { RegisterModelCalendar } from "../models/index";
import { CalendarValidation } from "../utils/index";
import { ICalendar } from "../Interface/interface";
import __ from "lodash";

export const GetAllSchedules = async (
  req: Request<{ limit: number }>,
  res: Response
) => {
  try {
    const CourseLimit: number = req.params.limit;

    const Data = await RegisterModelCalendar.find()
      .select({ _v: 0 })
      .limit(CourseLimit);
    if (Data) {
      res.status(200).json({ Data });
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

export const CreateSchedule = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      Class,
      Day,
      ClassName,
      TeacherNumber,
      HoursPerWeek,
      Teacher,
    }: ICalendar<string> = await req.body;

    // validate student credentials
    const Is_valid = await CalendarValidation({
      Class,
      Day,
      ClassName,
      TeacherNumber,
      HoursPerWeek,
      Teacher,
    });

    // verify if all fields are validated
    if (Is_valid) {
      const { value }: { value?: any } = await Is_valid;
      // first check if student already exists
      const getStudentData = await RegisterModelCalendar.findOne().where({
        ClassName,
      });

      if (getStudentData) {
        res
          .status(200)
          .json({ message: "this course already added", success: false });
      } else {
        const Data = await RegisterModelCalendar.create(value);
        await Data.save();
        res
          .status(200)
          .json({ message: "course created with success", success: true });
      }
    }
  } catch (error) {
    createHttpError.NotFound(`${error}`);
  }
};

export const EditSchedule = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      Class,
      Day,
      ClassName,
      TeacherNumber,
      HoursPerWeek,
      Teacher,
    }: ICalendar<string> = await req.body;

    // validate calendar info
    const Is_valid = await CalendarValidation({
      Class,
      Day,
      ClassName,
      TeacherNumber,
      HoursPerWeek,
      Teacher,
    });

    // verify if all fields are validated
    if (Is_valid) {
      const { value }: { value?: any } = await Is_valid;
      // update courses in the db
      const Data = await RegisterModelCalendar.findOneAndUpdate(value).where({
        _id,
      });
      await Data?.save();
      if (Data) {
        res
          .status(200)
          .json({ message: "course updated with success", success: true });
      }
    }
  } catch (error) {
    throw createHttpError.BadRequest(`${error}`);
  }
};

/* 
? deleteOne deletes a doc then outputting 1 as the doc length deleted so i got it 
* and compare it with a value of 1 in the Customizer to make sure that there's really a 
* a value deleted
*/
const Customizer = (value: number, otherValue: number) => {
  return value === otherValue;
};

export const DeleteSchedule = async (
  req: Request<{ _id: string }>,
  res: Response
) => {
  try {
    const { _id }: { _id: string } = await req.params;

    const Data = await RegisterModelCalendar.deleteOne({ _id });
    if (Data.acknowledged && __.isEqualWith(Data.deletedCount, 1, Customizer)) {
      res
        .status(200)
        .json({ message: "course deleted with success", success: true });
    }
  } catch (error) {
    throw createHttpError.NotFound(`${error}`);
  }
};
