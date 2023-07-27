type IdataForm = {
  _id: any;
  _ID_User: string;
  Firstname: string;
  Lastname: string;
  Password: string;
  ConfirmPassword: string;
  Email: string;
  StatusLevel: string;
  PromoCode: string;
};

type AdminInfo<T> = {
  AdminRegisteration: {
    Firstname: T;
    Lastname: T;
    Email: T;
    Password: T;
    ConfirmPassword: T;
    StatusLevel: T;
    PromoCode: T;
  };
};

type EditAdmin = {
  _id: any;
  _ID_User: string;
  Firstname: string;
  Lastname: string;
  Password: string;
  ConfirmPassword: string;
  Email: string;
  StatusLevel: string;
  PromoCode: string;
};

interface EditResponse {
  message: string;
  success: boolean;
}

interface Iadmin<S> {
  doc: {
    _id: any;
    _ID_User: S;
    Firstname: S;
    Lastname: S;
    Email: S;
    Password: S;
    ConfirmPassword: S;
    Image: S;
    StatusLevel: S;
    PromoCode: S;
  }[];
}

interface Idelete {
  _id: any;
  _ID_User: string;
}

interface IdeleteResponse {
  message: string;
  success: boolean;
}

type Idata = {
  _id: any;
  _ID_User: string;
  Firstname: string;
  Lastname: string;
  Password: string;
  ConfirmPassword: string;
  Email: string;
  StatusLevel: string;
  PromoCode: string;
};

export type {
  IdataForm,
  AdminInfo,
  EditAdmin,
  EditResponse,
  Idelete,
  IdeleteResponse,
  Idata,
  Iadmin,
};
