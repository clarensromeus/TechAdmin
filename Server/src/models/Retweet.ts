import { model, Types } from "mongoose";
import { RetweetSchema } from "../schema/index";

interface IRetweet {
  PostId: string;
  UserRetweetId: Types.ObjectId;
  TweetOwnerId: Types.ObjectId;
}

const RetweetModel = model<IRetweet>("Retweets", RetweetSchema);

export default RetweetModel;
