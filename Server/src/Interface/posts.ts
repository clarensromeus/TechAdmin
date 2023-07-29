import { Types } from "mongoose";

interface ILikes {
  _id: Types.ObjectId;
}

interface IComment {
  _id: Types.ObjectId;
}

interface IShare {
  _id: Types.ObjectId;
}

interface IRetweet {
  _id: Types.ObjectId;
}

// Post Types
interface Posts<S> {
  PostId: S;
  Title?: S;
  Image?: S;
  Retweeted?: boolean;
  RetweetedPost?: Types.ObjectId;
  Shared?: boolean;
  MakerId: S;
  User?: Types.ObjectId;
  Comments: Types.DocumentArray<IComment>;
  Likes: Types.DocumentArray<ILikes>;
  Shares?: Types.DocumentArray<IShare>;
  Retweets?: Types.DocumentArray<IRetweet>;
}

interface IParam {
  _id: string;
}
// Post types
interface IPost {
  Title?: string;
  PostId: string;
  MakerId: string;
  Retweeted: boolean;
  RetweetedPost: Types.ObjectId;
  User: Types.ObjectId;
}

type IPreference = "Like" | "dislike";

// Like types
interface ILike {
  _id?: Types.ObjectId;
  PostId: string;
  Preference?: IPreference;
  Identifier: string;
  User: Types.ObjectId;
  Post: Types.ObjectId;
}

// Comments types
interface IComment {
  PostId: string;
  Identifier: string;
  Body: string;
  User: Types.ObjectId;
  Post: Types.ObjectId;
}

interface IDelete {
  _id: Types.ObjectId;
  PostId: string;
  Image: string;
}

interface IPaginate {
  hasNext: boolean;
  nextCursor: string | undefined;
  lastPost: string;
}

interface Iq {
  limit: string;
  cursor: string;
}

export { ILike, IComment, IPost, IParam, IDelete, IPaginate, Iq, Posts };
