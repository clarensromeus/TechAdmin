type studentInfo<S> = {
  StudentRegisteration: {
    Firstname: S;
    Lastname: S;
    EmailorUsername: S;
    ClassOrpromocode: S;
    LevelOrLevelstatus: S;
    Password: S;
    PasswordConfirmation: S;
  };
};

type DataInfo = {
  Firstname: string;
  Lastname: string;
  Email?: string;
  Image?: string;
  Password: string;
  ConfirmPassword: string;
  StatusLevel?: string;
  PromoCode?: string;
  Username?: string;
  SchoolLevel?: string;
  Class?: string;
  Classname?: string;
};

type IValidation = {
  message: string;
  validation: string;
  matching: RegExp;
  ClassOrpromocode: string;
  LevelOrLevelstatus: string;
};

type IResponse = {
  message: string;
  token?: string;
  success: boolean;
  code: boolean;
  firstname?: string;
  lastname?: string;
};

type IState = {
  open: boolean;
  message: string;
};

export type { studentInfo, DataInfo, IValidation, IState, IResponse };
