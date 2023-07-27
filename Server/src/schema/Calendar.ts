import * as mongoose from "mongoose";

const { Schema } = mongoose;

// Register Types
interface ICalendar<S> {
  Class: S;
  Day: S;
  ClassName: S;
  TeacherNumber: number;
  HoursPerWeek: S;
  Teacher: S;
}

export const SchemaRegister = new Schema<ICalendar<string>>({
  Class: {
    type: String,
    required: true,
    trim: true,
  },
  Day: {
    type: String,
    required: true,
    trim: true,
  },
  ClassName: {
    type: String,
    required: true,
    trim: true,
  },
  TeacherNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  HoursPerWeek: { type: String, required: true, trim: true },
  Teacher: { type: String, required: true },
});
