import { Request, Response } from "express";
import { REDIS_CLIENT } from "../constants";
import createHttpError from "http-errors";

const LogOut = async (req: Request, res: Response) => {
  try {
    // when user is logged out delete all possible user data caches like token etc..
    // so that user cache data can be new on the server when user logged in back
    await REDIS_CLIENT.DEL(["USER_AUTH", "TOKEN", "REFRESH_TOKEN"]);
    res.status(200).json({ message: "logout with success" });
  } catch (error) {
    createHttpError.Conflict(`${error}`);
  }
};

export default LogOut;
