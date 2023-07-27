import { model, Types } from "mongoose";
import { StudentSchema } from "../schema/index";
import { IRegister } from "../Interface/Student";

export const RegisterModelStudent = model<IRegister<string>>(
  "Students",
  StudentSchema
);
