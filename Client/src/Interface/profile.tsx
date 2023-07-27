import { IPost } from './Home';

type IResponse = {
  message: string;
  success: boolean;
};

type IDataInfo<T> = {
  AdminEdit: {
    Firstname: T;
    Lastname: T;
    Email: T;
    Password: T;
    Username: T;
    StatusLevel: T;
    DOB: T;
  };
};

type IProfile = {
  follower: number;
  following: number;
  Post: IPost[];
};

type Iinfo = {
  Data: {
    _id: string;
    Firstname: string;
    Lastname: string;
    Image: string;
  };
};

export type { IResponse, IDataInfo, IProfile, Iinfo };
