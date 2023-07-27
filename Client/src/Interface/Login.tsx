type CredentialsType = {
  StudentLogin: { EmailorUsername: string; Password: string };
};

type IData = {
  message: string;
  token?: string;
  success: boolean;
};

type IValidation = {
  message: string;
  validation: string;
  matching: RegExp;
};

type IState = {
  open: boolean;
  message: string;
};

type IResponse = {
  message: string;
  token?: string;
  success: boolean;
  firstname?: string;
  lastname?: string;
};

type IMutate = {
  email?: string;
  password: string;
  username?: string;
};

export type { CredentialsType, IData, IValidation, IState, IResponse, IMutate };
