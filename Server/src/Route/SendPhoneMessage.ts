import { Request, Response, NextFunction } from "express";
import consola from "consola";
import createHttpError from "http-errors";
import { SendPhone_Verification } from "../utils/PhoneVerification";

const { info, success } = consola;

// SEND PHONE VERIFICATION
const SendPhoneMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // providing phone info
    await SendPhone_Verification();
    await res.status(200).json({
      message: success({ message: "sms sent with success", badge: true }),
    });
  } catch (error) {
    throw createHttpError.Unauthorized(`${error}`);
  }
};

export default SendPhoneMessage;
