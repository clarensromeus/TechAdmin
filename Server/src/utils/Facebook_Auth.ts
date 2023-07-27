import dotenv from "dotenv";
import passport from "passport";
import __ from "lodash";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { REDIS_CLIENT } from "../constants/index";
import { RegisterModelStudent } from "../models";
import { tokenAuth } from "./Auth";
import { RefreshToken } from "./RefreshToken";

type IFacebook = {
  Firstname: string;
  Lastname: string;
  Email: string;
  Image: string;
  Auth_Identity: string;
};

dotenv.config({ override: true });

const { FACEBOOK_ID, FACEBOOK_SECRET, FACEBOOK_CALLBACK_URI } = process.env;

// configure the strategy for Facebook Auth
passport.use(
  new FacebookStrategy(
    {
      clientID: `${FACEBOOK_ID}`,
      clientSecret: `${FACEBOOK_SECRET}`,
      callbackURL: "http://localhost:4000/auth/facebook/callback",
      profileFields: ["id", "displayName", "name", "email", "photos"],
    },
    // this function contains sensitive data of the user like name, email, id etc.. from profile passed as a param
    async function (accessToken, refreshingToken, profile, done) {
      const Facebook_Data: Partial<IFacebook> = {
        Firstname: profile.name?.familyName.toLowerCase(),
        Lastname: profile.name?.givenName.toLocaleLowerCase(),
        Email: profile.emails?.[0].value,
        Image: profile.photos?.[0].value,
        Auth_Identity: "FACEBOOK",
      };

      const doc = await RegisterModelStudent.findOne({
        Firstname: profile.name?.familyName.toLowerCase(),
        Lastname: profile.name?.givenName.toLowerCase(),
      });
      if (!__.isNil(doc)) {
        // check if user info not already exists
        const token = await tokenAuth(doc.toJSON(), `${doc.Firstname}`);
        const refreshToken = await RefreshToken(
          doc.toJSON(),
          `${doc.Firstname}`
        );

        await REDIS_CLIENT.mSet([
          "TOKEN",
          `${JSON.stringify(token)}`,
          "REFRESH_TOKEN",
          `${JSON.stringify(refreshToken)}`,
        ]);
        await REDIS_CLIENT.set("USER_AUTH", JSON.stringify(Facebook_Data));
        done(null, profile);
      } else {
        await REDIS_CLIENT.set("USER_AUTH", JSON.stringify(Facebook_Data));
        done(null, profile);
      }
      done(null, profile);
    }
  )
);

// serialize the user
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// deserialize the user
passport.deserializeUser(function (obj, cb) {
  //@ts-ignore
  cb(null, obj);
});
