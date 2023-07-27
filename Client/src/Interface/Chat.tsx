import * as React from 'react';

interface IChat<S> {
  _id?: S;
  ChatId: S;
  PicturedMessage?: S;
  Identifier: S;
  Sender: S;
  Message: S;
  createdAt?: S;
  User: S;
}

interface IUser {
  _id?: string;
  Identifier: string;
  Sender: string;
  PicturedMessage?: string;
  Message: string;
  createdAt: string;
  User: {
    Image: string;
  };
}

interface IFriends {
  doc: {
    _id: string;
    Friends: {
      _id: string;
      FriendId: string;
      User: {
        _id: string;
        Firstname: string;
        Lastname: string;
        Image: string;
        Email: string;
        Chat: IUser[];
      };
    }[];
    Chat: IUser[];
  };
}

interface IUserData {
  Friends: {
    _id: string;
    FriendId: string;
    User: {
      _id: string;
      Firstname: string;
      Lastname: string;
      Image: string;
      Email: string;
      Chat: IUser[];
    };
  };
}

interface IChatting {
  GuessData: IFriends['doc']['Friends'];
  ClientData: IUser[];
}

interface ISidechat {
  Friends: IFriends['doc']['Friends'];
  Chat: IUser[];
}

interface ISendImageFrameProps {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  PreviewImage: any;
  imageType: string;
  file: any;
  _id: string;
  Sender: string;
}

interface IseenMessage {
  _id: string[];
}

export type {
  IFriends,
  IUserData,
  IChat,
  IChatting,
  ISendImageFrameProps,
  IseenMessage,
  ISidechat,
};
