import { Response, Request, NextFunction } from "express";
import createHttpError from "http-errors";
import { RegisterModelStudent } from "../models";
import bcryptjs from "bcryptjs";
import { promisify } from "util";
import __ from "lodash";
// externally crafted imporst of ressources
import { tokenAuth } from "../utils/Auth";
import { RefreshToken } from "../utils/RefreshToken";
import { REDIS_CLIENT } from "../constants";

interface IUpdate {
  Email: string;
  Password: string;
}

const BCRYPT_SALT: (salt?: number) => Promise<unknown> = promisify(
  bcryptjs.genSalt
).bind(bcryptjs);

const BCRYPT_HASH: (
  passCode: string,
  hashCode: string | number
) => Promise<string> = promisify(bcryptjs.hash).bind(bcryptjs);

const RecoverPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Email, Password }: IUpdate = await req.body;
    // generate a salt of 10 bytes
    const hash: unknown = await BCRYPT_SALT(10);
    // get the password encoded
    const PasswHash: string = await BCRYPT_HASH(Password, `${hash}`);

    const doc = await RegisterModelStudent.findOneAndUpdate({
      Password: PasswHash,
      ConfirmPassword: PasswHash,
    }).where({ Email });

    if (!__.isNil(doc)) {
      // create user token
      const token = await tokenAuth(doc.toJSON(), `${doc.Firstname}`);
      // create refresh token
      const refreshToken = await RefreshToken(doc.toJSON(), `${doc.Firstname}`);
      // store refresh token in redis server for later use
      await REDIS_CLIENT.set("REFRESH_TOKEN", JSON.stringify(refreshToken));
      res.status(200).json({ token, doc });
      next();
    }
  } catch (error) {
    throw createHttpError[400](`${error}`);
  }
};

export { RecoverPassword };
