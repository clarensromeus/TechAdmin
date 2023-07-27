import { Request, Response, NextFunction } from "express";
import gateway from "../utils/PaymentConfiguration";
import createHttpError from "http-errors";
import braintree from "braintree";
// internally crafted imports of ressources
import { PaymentModel } from "../models/index";

interface IPayment {
  ID: string;
  Firstname: string;
  Lastname: string;
  Class: string;
  ClassName: string;
  Amount: number;
}

export const GetPaymentToken = async (req: Request, res: Response) => {
  try {
    // server generate the token
    const token = await gateway.clientToken.generate({});
    if (token) {
      // if token is created pass it to the Front_End
      res.status(200).json({ token: token.clientToken });
    }
  } catch (error) {
    throw createHttpError[400]();
  }
};

export const MakePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get nonce from the client which represents the customer payment authorization
    const nonceFromTheClient: string = await req.body.payment_method_nonce;
    const { ID, Firstname, Lastname, Class, ClassName, Amount }: IPayment =
      await req.body;

    // create transaction
    const transaction = await gateway.transaction.sale({
      amount: `${Amount}`,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    });
    // if payment is successful made the paid student
    await PaymentModel.create({
      ID,
      Firstname,
      Lastname,
      Class,
      ClassName,
      Fee: Amount,
    });
    res.status(200).json({
      success: true,
      message: `congratulation, you paid ${Amount} with success`,
    });
    next();
    res.status(200).json({ success: false, message: transaction.message });
  } catch {
    createHttpError.PaymentRequired("no payment made");
  }
};

export const GetPaidStudent = async (req: Request, res: Response) => {
  try {
    // get all paid students
    const doc = await PaymentModel.find();
    if (doc) {
      res.status(200).json({ doc });
    }
  } catch {
    createHttpError[400]();
  }
};
