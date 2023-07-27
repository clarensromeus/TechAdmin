import { model, Types } from "mongoose";
import { PaymentSchema } from "../schema/index";

interface IPayment {
  ID: string;
  Firstname: string;
  Lastname: string;
  Email?: string;
  Class: string;
  ClassName: string;
  Fee: number;
}

const PaymentModel = model<IPayment>("Payments", PaymentSchema);

export default PaymentModel;
