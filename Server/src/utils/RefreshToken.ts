import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { promisify } from "util";

dotenv.config();

const JWT_WEB_TOKEN = promisify(jwt.sign).bind(jwt);

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const RefreshToken = async (data: object, issuer: string) => {
  //@ts-ignore
  const tokenRefresh = await JWT_WEB_TOKEN(data, `${REFRESH_TOKEN}`, {
    algorithm: "HS384",
    issuer,
    subject: "personal token"
  });

  return tokenRefresh;
};
