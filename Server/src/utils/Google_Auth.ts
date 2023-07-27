import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import __ from "lodash";
// externally imports crafted imports of ressources
import { REDIS_CLIENT } from "../constants";
import { RegisterModelStudent } from "../models";
import { tokenAuth } from "./Auth";
import { RefreshToken } from "./RefreshToken";

type IGoogle = {
  Firstname: string;
  Lastname: string;
  Email: string;
  Image: string;
  Auth_Identity: string;
};

dotenv.config({ override: true }); // override any env variable similar to those of the main module

const { GOOGLE_ID, GOOGLE_SECRET, GOOGLE_CALLBACK_URI } = process.env;

const Server: Express = express();

// configure Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: `${GOOGLE_ID}`, // get ID on Google developper platform
      clientSecret: `${GOOGLE_SECRET}`, // get SECRET on Google developer platform
      callbackURL: `${GOOGLE_CALLBACK_URI}`, // create callback url to redirect to a desired page after login
      scope: ["profile"],
      state: true,
    },
    // this function contains sensitive data of the user like name, email, id etc.. from profile passed as a param
    async function verify(accessToken, refreshingToken, profile, done) {
      // store google data in redis server for later use
      const Google_Data: Partial<IGoogle> = {
        Firstname: profile._json.family_name?.toLowerCase(),
        Lastname: profile._json.given_name?.toLowerCase(),
        Email: profile._json.email,
        Image: profile._json.picture,
        Auth_Identity: "GOOGLE",
      };
      const doc = await RegisterModelStudent.findOne({
        Firstname: profile.name?.familyName.toLowerCase(),
        Lastname: profile.name?.givenName.toLowerCase(),
      });
      console.log(profile);
      if (!__.isNil(doc)) {
        // check if user info not already exists
        const token = await tokenAuth(doc.toJSON(), `${doc.Firstname}`);
        const refreshToken = await RefreshToken(
          doc.toJSON(),
          `${doc.Firstname}`
        );

        await REDIS_CLIENT.mSet([
          "TOKEN",
          JSON.stringify(token),
          "REFRESH_TOKEN",
          JSON.stringify(refreshToken),
        ]);
        await REDIS_CLIENT.set("USER_AUTH", JSON.stringify(Google_Data));
        done(null, profile);
      } else {
        await REDIS_CLIENT.set("USER_AUTH", JSON.stringify(Google_Data));
        done(null, profile);
      }
      done(null, profile);
    }
  )
);
