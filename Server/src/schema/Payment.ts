import { Schema, Types } from "mongoose";

interface IPayment {
  ID: string;
  Firstname: string;
  Lastname: string;
  Email?: string;
  Class: string;
  ClassName: string;
  Fee: number;
}

const SchemaPayment = new Schema({
  ID: { type: String, required: false, trim: true },
  Firstname: { type: String, trim: true, required: true },
  Lastname: { type: String, trim: true, required: true },
  Email: { type: String, trim: true, required: false },
  Class: { type: String, required: true },
  ClassName: { type: String, required: true },
  Fee: { type: Number, required: true },
});

export { SchemaPayment };
