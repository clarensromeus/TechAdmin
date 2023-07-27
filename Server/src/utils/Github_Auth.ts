import * as dotenv from "dotenv";
import passportGit from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import __ from "lodash";
// external imports of ressources
import { REDIS_CLIENT } from "../constants";
import { tokenAuth } from "./Auth";
import { RefreshToken } from "./RefreshToken";
import { RegisterModelStudent } from "../models";

interface IGithub {
  Firstname: string;
  Lastname: string;
  Email: string;
  Image: string;
  Auth_Identity: string;
}

dotenv.config();

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URI } =
  process.env;

// configure the strategy for GITHUB
passportGit.use(
  new GitHubStrategy(
    {
      clientID: `${GITHUB_CLIENT_ID}`,
      clientSecret: `${GITHUB_CLIENT_SECRET}`,
      callbackURL: `${GITHUB_CALLBACK_URI}`,
    },

    // this function contains sensitive data of the user like name, email, id etc.. from profile passed as a param
    // @ts-ignore
    async function (accessToken, refreshingToken, profile, done) {
      // store google data in redis server for later use
      const Github_Data: Partial<IGithub> = {
        Firstname: profile.displayName.split(" ")[0],
        Lastname: profile.displayName.split(" ")[1],
        Email: profile.emails?.[0].value,
        Image: profile.photos?.[0].value,
        Auth_Identity: "GITHUB",
      };
      const doc = await RegisterModelStudent.findOne({
        Firstname: "romeus",
        Lastname: "clarens",
      }).select(" -Friends -Chat -Notifications");

      if (!__.isNil(doc)) {
        // check if user info not already exists
        const token = await tokenAuth(doc.toJSON(), `${doc.Firstname}`);
        const refreshToken = await RefreshToken(
          doc.toJSON(),
          `${doc.Lastname}`
        );

        await REDIS_CLIENT.mSet([
          "TOKEN",
          `${JSON.stringify(token)}`,
          "REFRESH_TOKEN",
          `${JSON.stringify(refreshToken)}`,
        ]);
        await REDIS_CLIENT.set("USER_AUTH", JSON.stringify(Github_Data));
        done(null, profile);
      } else {
        await REDIS_CLIENT.set("USER_AUTH", JSON.stringify(Github_Data));
        done(null, profile);
      }
      done(null, profile);
    }
  )
);
