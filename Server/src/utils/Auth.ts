import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { promisify } from "util";

dotenv.config();

const JWT_WEB_TOKEN = promisify(jwt.sign).bind(jwt);
const JWT_VERIFY_TOKEN = promisify(jwt.verify).bind(jwt);

const Access_Token = process.env.ACCESS_TOKEN;

export const tokenAuth = async (data: object, issuer: string) => {
  //@ts-ignore
  const token = await JWT_WEB_TOKEN(data, `${Access_Token}`, {
    algorithm: "HS384", // token encoded algorithm
    issuer, // a unique key for user authenticity
    subject: "personal token",
    expiresIn: "62d", // token will be expired in 2 months
  });

  return token;
};

// for generating the secret code i'm using nodejs crypto module by getting from the
// random Bytes and convert it to string to have a more secure and a better
// proffessional hash-looking token secret instead of a simple string
