import * as mongoose from "mongoose";
import { TeacherSchema } from "../schema/index";

// Teacher Types
interface ITeacher<S> {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  PhoneNumber: S;
  Email: S;
  Image?: S;
  HoursPerWeek: S;
}

const { model } = mongoose;

export const RegisterModelTeacher = model<ITeacher<string>>(
  "Teachers",
  TeacherSchema
);
