import * as mongoose from "mongoose";
import { CalendarSchema } from "../schema/index";

// Calendar Types
interface ICalendar<S> {
  Class: S;
  Day: S;
  ClassName: S;
  TeacherNumber: number;
  HoursPerWeek: S;
  Teacher: S;
}

const { model } = mongoose;

export const RegisterModelCalendar = model<ICalendar<string>>(
  "Calendar",
  CalendarSchema
);
