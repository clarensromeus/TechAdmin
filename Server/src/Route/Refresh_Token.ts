import { Request, Response } from "express";
import createHttpError from "http-errors";
import { REDIS_CLIENT } from "../constants";
import __ from "lodash";

const RefreshClientToken = async (req: Request, res: Response) => {
  try {
    const isTokenExist = await REDIS_CLIENT.EXISTS("REFRESH_TOKEN");
    if (__.isBoolean(isTokenExist) && !__.isNil(isTokenExist)) {
      // if token exist get it and send it to the client
      const token: string | null = await REDIS_CLIENT.GET("REFRESH_TOKEN");
      res.status(200).json({ token });
    }
  } catch (error) {
    createHttpError[401](`${error}`);
  }
};

export default RefreshClientToken;
