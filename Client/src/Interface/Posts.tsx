import * as React from 'react';

type IPreference = 'likes' | 'dislikes';

interface ILike {
  _id: string;
  PostId: string;
  Identifier: string;
  Preference: IPreference;
  User: string;
  Post: string;
}

interface IResponse {
  NumberofLike: number;
}

interface User {
  _id: string;
  Firstname: string;
  Lastname: string;
  Image: string;
}

interface IComment {
  createdAt?: string;
  PostId: string;
  Identifier: string;
  Body?: string;
  User: string | User;
  Post: string;
  ReceiverId?: string;
  Title?: string;
}

interface RetweetedPost {
  _id: string;
  PostId: string;
  Title: string;
  Image: string;
  createdAt: string;
  User: Pick<User, '_id' | 'Image' | 'Firstname' | 'Lastname'>;
}

interface postData {
  _id: string;
  PostId: string;
  Title?: string;
  Image?: string;
  Retweeted?: string;
  RetweetedPost?: RetweetedPost;
  Retweets: string[];
  MakerId: string;
  createdAt: string;
  updatedAt: string;
  User: User;
  Likes: {
    _id: string;
    Identifier: string;
    PostId: string;
    User: {
      _id: string;
      Firstname: string;
      Lastname: string;
    };
  }[];
  Comments: {
    createdAt: string;
    PostId: string;
    Identifier: string;
    Body: string;
    User: User;
  }[];
}

interface IPost {
  nextCursor?: string;
  doc: postData[];
}

interface IPages {
  pages: IPost[];
}

interface IGetComment {
  doc: postData;
}

interface IShareProps {
  share: string;
  setShare: React.Dispatch<React.SetStateAction<string>>;
  data: {
    _id: string;
    PostId: string;
    UserPostId: string;
    Title: string;
    Image: string;
  };
}

interface IState {
  DialogOpen: string;
  CloseDialog: () => void;
  Info: Omit<IComment, 'Body'>;
  UserImage: string;
}

interface ShortCommentProps {
  info: {
    PostInfo: IState['Info'];
  };
}

interface IFriend {
  status: string;
  FriendId: string;
  Identifier: string;
  User: string;
}

interface IRetweetData {
  _id: string;
  PostId: string;
  UserRetweetId: string;
  TweetOwnerId: string;
  UserId: string;
  MakerId: string;
  Title: string;
}

interface IRetweet {
  openPopper: boolean;
  anchorElPopper: HTMLButtonElement | null;
  Data: IRetweetData;
}

interface IAction {
  _id: string;
  UserPostId: string;
  PostId: string;
  Title: string;
  Image: string;
}

interface IPostAction {
  open: boolean;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  handleClose: () => void;
  anchorEl: null | HTMLElement;
  Data: IAction;
}

interface IPostFrame {
  OpenDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseDialog: () => void;
  UserId: string;
}

interface IPostFrameUpdate {
  OpenDialogUpdate: boolean;
  setOpenDialogUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseDialogUpdate: () => void;
  _id: string;
  PostId: string;
  Title: string;
  Image: string;
}

interface IShare {
  _id: number[];
  Identifier: string;
  ChatId: string;
  PicturedMessage: string;
  Message: string;
  Sender: string;
  User: string;
}

interface IPostCard {
  _id: string;
  Firstname: string;
  Lastname: string;
}

export type {
  IPost,
  ILike,
  IResponse,
  IComment,
  IState,
  IFriend,
  IRetweet,
  IRetweetData,
  IPostAction,
  IAction,
  IPostFrame,
  IPostFrameUpdate,
  IShareProps,
  IShare,
  IPages,
  IPostCard,
  ShortCommentProps,
  postData,
  IGetComment,
};
