import React from 'react';

// for data types
interface IinfoState<T> {
  _id: string;
  _ID_User: T;
  Firstname: T;
  Lastname: T;
  Email: T;
  Password: T;
  ConfirmPassword: T;
  PersonStatus: T;
  Image?: T;
  Class?: T;
  SchoolLevel?: T;
  NoteLevel?: T;
  StatusLevel?: T;
  PromoCode?: T;
}

interface IGetData {
  Data: IinfoState<string>;
}

type IAuthState = {
  type: string;
  status: string;
  toggle: boolean;
  Payload: Partial<IinfoState<string>>;
};

interface IHistoryProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ISearchProps {
  anchorElSearch: any | null;
  setAnchorElSearch: React.Dispatch<React.SetStateAction<any | null>>;
  search: string;
}

export type { IAuthState, IHistoryProps, ISearchProps, IGetData };
