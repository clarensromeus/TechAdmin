import { model, Types } from "mongoose";
import { CommentsSchema } from "../schema/index";

// Post Types
interface Comment<S> {
  Identifier: S;
  PostId: S;
  Body: S;
  User: Types.ObjectId;
  Post: Types.ObjectId;
}

const CommentsModel = model<Comment<string>>("Comments", CommentsSchema);

export default CommentsModel;
