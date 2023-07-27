import * as mongoose from "mongoose";

const { Schema } = mongoose;

// Register Types
interface ITeacher<S> {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  PhoneNumber: S;
  Email: S;
  Image?: S;
  HoursPerWeek: S;
}

export const SchemaRegister = new Schema<ITeacher<string>>({
  _ID_User: { type: String, required: true, trim: true },
  Firstname: {
    type: String,
    required: true,
    trim: true,
  },
  Lastname: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
    trim: true,
  },
  Image: { type: String, trim: true },
  PhoneNumber: { type: String, required: true, trim: true },
  HoursPerWeek: { type: String, required: true, trim: true },
});
