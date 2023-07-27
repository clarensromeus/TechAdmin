import * as mongoose from "mongoose";
import dotenv from "dotenv";
import createError from "http-errors";

dotenv.config({ override: true });

const { DB_USER_NAME, DB_PASSWORD } = process.env;
const DB_URI = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@adminapp.kyb5qr1.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", true);

// create connection to DB
export const DB_CONNECTION = async (ConfigParser: boolean) => {
  try {
    await mongoose.connect(DB_URI, {
      // use ipV4 only
      family: 4,
    });

    console.log(
      `successfully connected to the DB using ${DB_USER_NAME} and ${DB_PASSWORD}`
    );
  } catch (error) {
    throw createError.NotFound(`error is ${error}`);
  }
};

//
