import { model, Types } from "mongoose";
import { PostsSchema } from "../schema/index";
import { Posts } from "../Interface/posts";

const PostsModel = model<Posts<string>>("Posts", PostsSchema);

export default PostsModel;
