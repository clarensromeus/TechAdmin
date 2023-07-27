import { Request, Response } from "express";
import createHttpError from "http-errors";
import { REDIS_CLIENT } from "../constants";

const AuthRedirection = async (req: Request, res: Response) => {
  try {
    const userAuthentication: (string | null)[] = await REDIS_CLIENT.MGET([
      "USER_AUTH",
      "TOKEN",
    ]);
    const userAuth: any = JSON.parse(`${userAuthentication[0]}`);
    const token: any = JSON.parse(`${userAuthentication[1]}`);
    const isExist: number = await REDIS_CLIENT.EXISTS("TOKEN");

    if (isExist === 1) {
      // if user already loggedin push this response to the user
      res.status(200).json({ token, userAuth });
    } else {
      res.status(200).json({ userAuth });
    }
  } catch (error) {
    createHttpError[400](`${error}`);
  }
};

export default AuthRedirection;
