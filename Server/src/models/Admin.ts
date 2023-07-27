import { model, Types } from "mongoose";
import { AdminSchema } from "../schema/index";
import IRegister from "../Interface/Admin";

export const RegisterModelAdmin = model<IRegister<string>>(
  "admin",
  AdminSchema
);
