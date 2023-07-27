import { model, Types } from "mongoose";
import { LikesSchema } from "../schema/index";

type IPreference = "Like" | "dislike";

interface ILike {
  PostId: string;
  Identifier: string;
  Preference?: IPreference;
  User: Types.ObjectId;
  Post: Types.ObjectId;
}

const LikesModel = model<ILike>("Likes", LikesSchema);

export default LikesModel;
