import React from 'react';

type NotiReference =
  | 'comments'
  | 'likes'
  | 'follow'
  | 'unfollow'
  | 'messaged'
  | 'Accepted'
  | 'dislikes'
  | 'Retweeted'
  | 'shares'
  | 'paid'
  | 'registered'
  | 'deleted';

interface INotifications {
  _id?: number[];
  ReceiverId?: string;
  ActionPerformer?: string; // for admin
  NotiId: string;
  Sender: string;
  SendingStatus: boolean;
  NotiReference: NotiReference;
  AlertText: string;
  User: string;
}

interface User {
  _id: string;
  Firstname: string;
  Lastname: string;
  Image: string;
}

interface IGetNotifications {
  doc: {
    Notifications: {
      _id: string;
      ReceiverId: string;
      NotiId: string;
      Sender: string;
      NotiReference: NotiReference;
      SendingStatus: boolean;
      AlertText: string;
      User: User;
    }[];
  };
}

interface IDelete {
  _id: string;
  NotiId: string;
  SenderId: string;
}

interface IMessageNotiProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  Notifications?: IGetNotifications['doc']['Notifications'];
}

interface IDisplayNotiProps {
  openNoti: boolean;
  setOpenNoti: React.Dispatch<React.SetStateAction<boolean>>;
  Notifications?: IGetNotifications['doc']['Notifications'];
}

interface IMobileDrawerProps {
  _id: string;
  Firstname: string;
  Lastname: string;
  openMoDrawer: boolean;
  Image: string;
  setOpenMoDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export type {
  INotifications,
  IGetNotifications,
  IDelete,
  IMessageNotiProps,
  IDisplayNotiProps,
  IMobileDrawerProps,
};
