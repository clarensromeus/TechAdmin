type editData = {
  _id: any;
  _ID_User: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Password: string;
  Class: string;
  ConfirmPassword: string;
  SchoolLevel: string;
  ClassName: string;
};

interface datatoken {
  dataToken: {
    _id: string;
    _ID_User: string;
    Firstname: string;
    Lastname: string;
    Email: string;
    Username: string;
    Password: string;
    ConfirmPassword: string;
    Image: string;
    Class: string;
    ClassName: string;
    SchoolLevel: string;
    StatusLevel: string;
    PromoCode: string;
  };
}

type ICreateStudent<T> = {
  Firstname: T;
  Lastname: T;
  Email: T;
  Password: T;
  Class: T;
  Image: T;
  ConfirmPassword: T;
  SchoolLevel: T;
  ClassName: T;
};

interface Idelete {
  _id: any;
  _ID_User: string;
}

interface IdeleteResponse {
  message: string;
  success: boolean;
}

interface IStudent<S> {
  _id: S;
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  Image: S;
  SchoolLevel: S;
  Class: S;
  ClassName: S;
}

interface IStudentData<S> {
  doc: IStudent<S>[];
}

interface IInfo<S> {
  doc: IStudent<S>;
}

interface IResponse {
  message: string;
  success: boolean;
}

interface IState {
  open: boolean;
}

interface IcardInfo {
  Image: string;
  Firstname: string;
  Lastname: string;
}

interface Iunfollow {
  _id: string;
  User: string;
}

interface IunfollowResponse {
  message: string;
  success: boolean;
}

interface IWindow {
  width?: number;
  height?: number;
}

export type {
  editData,
  ICreateStudent,
  Idelete,
  IdeleteResponse,
  datatoken,
  IResponse,
  IState,
  IStudentData,
  IInfo,
  IcardInfo,
  Iunfollow,
  IunfollowResponse,
  IWindow,
};
